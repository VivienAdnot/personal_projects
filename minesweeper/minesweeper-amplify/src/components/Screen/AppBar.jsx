import React from 'react';
import PropTypes from 'prop-types';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { Hub } from 'aws-amplify';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';

import { config } from '../../config';

import logo from '../../img/bigmine.png';

function Greeting() {
  const { authStatus, user, signOut } = useAuthenticator(context => [context.authStatus]);

  const onLogin = () => {
    Hub.dispatch('AuthenticationChannel',  { event: 'loginRequest' });
  };

  const onRegister = () => {
    Hub.dispatch('AuthenticationChannel',  { event: 'registerRequest' });
  };

  if (authStatus === 'authenticated') {
    return <Typography color="inherit" variant="h6">
      Welcome {user.username}
      <Button color="inherit" onClick={signOut}>Log out</Button>
    </Typography>;
  } else {
    return (
      <div>
        <Button color="inherit" onClick={onLogin}>Login</Button>
        <Button color="inherit" onClick={onRegister}>Register</Button>
      </div>
    );
  }
}

function ButtonAppBar(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} color="primary">
        <Toolbar>
          <Link to='/rules'><img src={logo} /></Link>
          <Typography className={classes.title} variant="h5" color="inherit" noWrap>
            {config.title}
          </Typography>

          <Link className={classes.btnHref} to='/game'>
            <Typography variant="h6" color="inherit" noWrap>Play</Typography>
          </Link>
          <Link className={classes.btnHref} to='/rules'>
            <Typography variant="h6" color="inherit" noWrap>Rules</Typography>
          </Link>

          <div className={classes.spacer}></div>

          <Greeting />
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
}

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

export default withStyles(styles)(ButtonAppBar);