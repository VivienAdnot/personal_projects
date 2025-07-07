import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Hub } from 'aws-amplify';

import Modal from './Modal.jsx';

function ModalOpener() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // listen to user authentication requests
  useEffect(() => {
    const onAuthEvent = (authEvent) => {
      // console.log('auth event', authEvent);
      const { payload } = authEvent;
      const { event } = payload;
      
      switch (event) {
        case 'loginRequest':
          console.log('authentication login event');
          setShowLoginModal(true);
          break;
        case 'registerRequest':
          console.log('authentication register event');
          setShowRegisterModal(true);
          break;
        default:
          console.log('other authentication event', event);
      }
    };
    Hub.listen('AuthenticationChannel', onAuthEvent);

    return () => {
        Hub.remove('AuthenticationChannel', onAuthEvent);
    };
});

  // listen to game events
  useEffect(() => {
    const onGameEvent = (gameEvent) => {
      // console.log('auth event', authEvent);
      const { payload } = gameEvent;
      const { event } = payload;
      
      switch (event) {
        case 'win':
          console.log('Game win event');
          setShowLoginModal(true);
          break;
        default:
          console.log('other Game event', event);
      }
    };

    Hub.listen('Game', onGameEvent);

    return () => {
      Hub.remove('Game', onGameEvent);
    };
  });

  // do not display auth modal if user is already logged in;
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const unAuth = authStatus !== 'authenticated';

  if (!unAuth) return null;

  if (showLoginModal) return <Modal tab={"signIn"}/>;
  if (showRegisterModal) return <Modal tab={"signUp"}/>;

  // default case
  return null;
}

export default ModalOpener;
