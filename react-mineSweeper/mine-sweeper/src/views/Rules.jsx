import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        marginTop: '70px'
    },
    content: {
        padding: '0 50px'
    },
    title: {
        width: 640,
        textAlign: 'center'
    },
    buttonContainer: {
        width: 640
    },
    buttonPlayHref: {
        '&:hover': {
            textDecoration: 'none'
        },
        marginTop: '20px',
        textAlign: 'center',
        display: 'block',
        fontSize: '0.875rem',
        minWidth: '64px',
        boxSizing: 'border-box',
        minHeight: '36px',
        fontWeight: 500,
        fontFamily: 'Roboto',
        lineHeight: '1.4em',
        borderRadius: '4px',
        textTransform: 'uppercase',
        color: 'white',
        textDecoration: 'none'
    }
});

function Rules(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <h1 className={classes.title}>Instructions for MineSweeper</h1>

                <YouTube videoId="MPKXNLkDz10" opts={{
                    height: '390',
                    width: '640',
                    playerVars: { autoplay: 1 }
                }} />

                <div className={classes.buttonContainer}>
                    <Link to='/game' className={classes.buttonPlayHref}>
                        <Button className={classes.buttonPlay} variant="contained" size="large" color="primary">
                            Play now
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

Rules.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rules);