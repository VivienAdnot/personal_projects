import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import { AppContext } from './AppProvider';
import AppBar from './components/Screen/AppBar.jsx';
import DisplayRegisterDialogIfNeeded from './components/Auth/Register/DisplayRegisterDialogIfNeeded.jsx';
import DisplayLoginDialogIfNeeded from './components/Auth/Login/DisplayLoginDialogIfNeeded.jsx';
import Game from './components/Game/Game.jsx';
import Rules from './views/Rules.jsx';
import Drawer from './components/Screen/Drawer.jsx';

import './style/App.css';


let godModsecretCode = 'audreydiallo';
let secretCodeBuffer = [];
const winOnNextClickCommand = 'winnext';

const stringContains = (strSource, str) => strSource.indexOf(str) !== -1;

const isMobileDevice = () => {

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);

}

const minimumScreenSizeOk = () => {

    return !isMobileDevice() && window.innerWidth >= 1200 && window.innerHeight >= 600;

}

const renderApp = (props) => {

    return (
        <AppContext.Consumer>
        {(context) =>
            <div className="root">
                <DisplayRegisterDialogIfNeeded></DisplayRegisterDialogIfNeeded>
                <DisplayLoginDialogIfNeeded></DisplayLoginDialogIfNeeded>
                <AppBar />
                <Drawer></Drawer>
                <Switch>
                    <Route exact path='/' component={Rules}/>
                    <Route path='/rules' component={Rules}/>
                    <Route path='/game' render={() => <Game {...props} context={context} />}/>
                </Switch>
            </div>
        }
        </AppContext.Consumer>
    );

};

const renderMinScreenSizeError = () => {

    return (
        <div className="root">
            <AppBar />
            <div style={{margin:"100px auto 0 auto"}}>
                <h1 >Sorry, your screen is too small.</h1>
                <h2>This game is designed for desktop screens.</h2>
                <h2>The minimum required screen size to be able to play the game is 1200px x 600px.</h2>
            </div>
        </div>
    );

};

class App extends Component {

    state = {
        godMode: false
    }

    componentWillMount() {
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    }

    onKeyPressed(e) {

        secretCodeBuffer.push(e.key);
        const buffer = secretCodeBuffer.join('');

        if (this.state.godMode && stringContains(buffer, winOnNextClickCommand)) {
            this.setState({ winNext: true });
        }

        if (stringContains(buffer, godModsecretCode)) {
            secretCodeBuffer = [];
            this.setState((prevState) => ({
                godMode: !prevState.godMode,
                winNext: false
            }));
        }

    }

    render() {

        const ScreenToRender = (minimumScreenSizeOk())
            ? renderApp
            : renderMinScreenSizeError;

        return <ScreenToRender {...this.state}/>

    }

}

export default App;
