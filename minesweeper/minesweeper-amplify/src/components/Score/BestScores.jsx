import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Hub } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

import { config } from '../../config';
import { getBestScores, createScore } from '../../services/scores';

let tempScores = [];

// do it first in memory
// then use local storage
const saveTempScore = (score) => {
  tempScores.push(score);
  console.log('temp score saved', tempScores);
};

// we use a separate function to clear array because it could be optimized
const clearTempScores = () => {
  tempScores = [];
  console.log('temp scores cleared', tempScores);
}

function BestScores(props) {
    const { classes } = props;
    const { user } = useAuthenticator((context) => [context.user]);
    console.log(user);

    const [bestScores, setBestScores] = useState([]);

    // we must keep this method inside the component
    // because we can't use state modifiers outside the body of the component
    function fetchBestScores(source) {
        getBestScores()
        .then((scores) => {
            console.log(source, 'BestScores: state set best scores')
            setBestScores(scores);
        })
        .catch(err => {
            console.log(source, 'catch', err);
        })
    }
    
    // init: fetch scores
    useEffect(() => {
        fetchBestScores('initial');
        // on unmount
        return () => {};
    }, []);

    // on game win:
    //    if unauth: save temp score
    //    if auth: send score to api then fetch scores
    // on game start:
    //    fetch scores
    useEffect(() => {
        const onGameEvent = async (gameEvent) => {
            console.log('game event', gameEvent);
            const { payload } = gameEvent;
            const { event, data } = payload;
    
            switch (event) {
                case 'win':
                    const { score } = data;
                    // user is undefined if unauthenticated
                    if (user) {
                        console.log('BestScores: listened win auth');
                        await createScore({ score, username: user.username });
                        await fetchBestScores('win');
                    } else {
                        console.log('BestScores: listened win unauth');
                        saveTempScore(score);
                    }
                    break;
                case 'start':
                    console.log('BestScores: listened start');
                    await fetchBestScores('start');
                    break;
                default:
                    console.log('BestScores: listened unknown', payload);
            }
        };
        Hub.listen('Game', onGameEvent);
    
        return () => {
            Hub.remove('Game', onGameEvent);
        };
    });

    // on auth:
    //    send all temp scores to api
    //    then clear temp scores array
    //    then fetch scores
    useEffect(() => {
        const onAuthEvent = async (authEvent) => {
            console.log('auth event', authEvent);

            const { payload } = authEvent;
            const { event, data } = payload;
            
            switch (event) {
                case 'signIn':
                case 'signUp':
                    console.log('auth event', event, data);
                    // we retrieve user from the auth event
                    const { username } = data;

                    // if no score to process, stop
                    if (!tempScores.length) {
                        console.log('no temp score to be saved. stop');
                        return;
                    }
                    // process all the temp scores
                    // we use an old-style for loop because it awaits
                    for (let score of tempScores) {
                        console.log('save temp score', score);
                        await createScore({ score, username });
                    }
                    clearTempScores();
                    await fetchBestScores('auth');
                    break;
                default:
                    console.log('other auth event', event, data);
            }
        };
        Hub.listen('auth', onAuthEvent);
    
        return () => {
            Hub.remove('auth', onAuthEvent);
        };
    })

    return (
        <div className={classes.bestScoresRoot}>
            <h1 className={classes.title}>Fastest finishes</h1>
            <Divider />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Ranking</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bestScores.map((bestScore, index) => {
                        return (
                            <TableRow key={bestScore.id}>
                                <TableCell>#{index + 1}</TableCell>
                                <TableCell>{bestScore.user}</TableCell>
                                <TableCell>{bestScore.score}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

BestScores.propTypes = {
  classes: PropTypes.object.isRequired
}

const styles = theme => ({
  bestScoresRoot: {
    width: config.drawerWidth
  },
  title: {
    textAlign: 'center'
  }
});

export default withStyles(styles)(BestScores);