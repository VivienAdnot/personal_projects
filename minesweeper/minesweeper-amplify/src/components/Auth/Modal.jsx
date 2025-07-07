import { Authenticator } from '@aws-amplify/ui-react';

function AuthModal({ tab }) {
  // allowed values for tab are signIn or signUp
  return (
    <Authenticator initialState={tab} variation="modal">
    </Authenticator>
  );
}

export default AuthModal;