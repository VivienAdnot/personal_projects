import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@aws-amplify/ui-react/styles.css';

import AppBar from './components/Screen/AppBar.jsx';
import Drawer from './components/Screen/Drawer.jsx';
import Game from './components/Game/Game.jsx';
import Rules from './views/Rules.jsx';
import validateMinScreenSizeAndDesktop from './utils/screenRequirementsValidator';

import './style/App.css';

function AppValid() {
  return (
    <div className="root">
      <BrowserRouter>
        <AppBar />
        {/* side menu */}
        <Drawer></Drawer>

        <Routes>
          {/* default path is Game */}
          <Route exact path='/' element={<Game />}/>
          <Route path='/game' element={<Game />}/>
          <Route path='/rules' element={<Rules />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function AppError() {
  return (
      <div className="root">
        <BrowserRouter>
            <AppBar />
            <div style={{margin:"100px auto 0 auto"}}>
                <h1 >Sorry, your screen is too small.</h1>
                <h2>This game is designed for desktop screens.</h2>
                <h2>The minimum required screen size to be able to play the game is 1200px x 600px.</h2>
            </div>
          </BrowserRouter>
      </div>
  );
}

function App() {
  return validateMinScreenSizeAndDesktop() ? <AppValid/> : <AppError/>
}

export default App;
