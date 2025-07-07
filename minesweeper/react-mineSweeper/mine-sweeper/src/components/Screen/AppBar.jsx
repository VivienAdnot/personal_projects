import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';

import { AppContext } from '../../AppProvider';
import { config } from '../../config';

import logo from '../../img/bigmine.png';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 1,
    },
    spacer: {
        flex: 1
    },
    title: {
        marginLeft: '40px',
        marginRight: '110px'
    },
    btnHref: {
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.08)'
        },
        padding: '8px 16px',
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

function Greeting(context) {
    const { isAuthenticated, user, requestShowRegisterPopup, requestShowAuthenticatePopup } = context;

    if (isAuthenticated) {

        return <Typography color="inherit" variant="subheading">Welcome {user.fullName}</Typography>;

    } else {

        return (
            <div>
                <Button color="inherit" onClick={requestShowAuthenticatePopup}>Login</Button>
                <Button color="inherit" onClick={requestShowRegisterPopup}>Register</Button>
            </div>
        );

    }
}

function ButtonAppBar(props) {

    const { classes } = props;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppContext.Consumer>
                {(context) =>
                    <AppBar position="fixed" className={classes.appBar} color="primary">
                        <Toolbar>
                            <Link to='/rules'>
                                <img src={logo} />
                            </Link>
                            <Typography className={classes.title} variant="title" color="inherit" noWrap>
                                {config.title}
                            </Typography>

                            <Link className={classes.btnHref} to='/game'>Play</Link>
                            <Link className={classes.btnHref} to='/rules'>Rules</Link>

                            <div className={classes.spacer}></div>

                            <Greeting {...context} />
                        </Toolbar>
                    </AppBar>
                }
                </AppContext.Consumer>
        </div>
    );

}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ButtonAppBar);