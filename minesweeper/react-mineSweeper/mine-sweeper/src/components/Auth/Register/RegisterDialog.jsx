import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import RegisterForm from './RegisterForm.jsx';
import { AppContext } from '../../../AppProvider';

class RegisterDialog extends Component {

    render() {
        return (
            <AppContext.Consumer>
                {(context) => <Dialog open={true}  onClose={() => context.requestHideRegisterPopup()}>
                    <DialogTitle>Register</DialogTitle>
                    <RegisterForm onUserCreated={(userCreatedWithToken) => {
                        context.onUserCreated(userCreatedWithToken);
                    }}/>
                </Dialog>
                }
            </AppContext.Consumer>
        );
    }
}

export default RegisterDialog;