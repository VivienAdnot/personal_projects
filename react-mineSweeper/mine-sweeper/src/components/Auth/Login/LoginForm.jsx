import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { requestAuthenticateUser } from '../../../services/users';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    button: {
        margin: theme.spacing.unit
    }
});

class LoginForm extends Component {

    state = {
        email: '',
        password: ''
    };

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.id;

        const newVal = {
            [name]: value
        };

        this.setState(newVal);
    };

    handleSubmit = event => {
        event.preventDefault();

        requestAuthenticateUser({
            email: this.state.email,
            password: this.state.password
        })
        .then(({ data: userWithToken }) => {

            this.props.onUserAuthenticated(userWithToken);

        })
        .catch(err => console.error('ERROR LOGIN USER', err));
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <form className={classes.container} onSubmit={this.handleSubmit}>
                    <TextField
                        className={classes.textField}
                        id="email"
                        label="Email"
                        type="email"
                        margin="normal"
                        fullWidth
                        onChange={this.handleInputChange}
                    />
                    <TextField
                        className={classes.textField}
                        id="password"
                        label="Password"
                        type="password"
                        margin="normal"
                        fullWidth
                        onChange={this.handleInputChange}
                    />
                    <Button
                        className={classes.button}
                        variant="raised"
                        color="primary"
                        label="Submit"
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
    onUserAuthenticated: PropTypes.func
};

export default withStyles(styles)(LoginForm);