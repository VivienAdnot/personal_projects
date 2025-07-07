import React from 'react';
import LoginDialog from './LoginDialog.jsx';
import { AppContext } from '../../../AppProvider';

const DisplayLoginDialogIfNeeded = (props) => (
    <div>
        <AppContext.Consumer>
            {(context) => context.showAuthenticatePopup
                ? <LoginDialog></LoginDialog>
                : null
            }
        </AppContext.Consumer>
    </div>
);

export default DisplayLoginDialogIfNeeded;