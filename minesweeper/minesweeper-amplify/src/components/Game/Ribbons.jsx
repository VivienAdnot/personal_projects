import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

function RibbonReady() {
  return (
    <div className="alert alert-warning">
      <Typography color="inherit" variant="body2">
        Ready to play. Click on any square to start the game !
      </Typography>
      <Link to='/rules'>Learn how to play</Link>
    </div>
  );
}

function RibbonWin({ timer }) {
  return (
    <div className="alert alert-success">
      <Typography color="inherit" variant="body2">
        You won the game in {timer} seconds !
      </Typography>
    </div>
  );
}

function RibbonLoss() {
  return (
    <div className="alert alert-danger">
      <Typography color="inherit" variant="body2">
        You lost the game
      </Typography>
    </div>
  );
}

function RibbonPlaying({ timer }) {
  return (
    <div className="alert alert-warning">
      Playing. Performance: {timer}
    </div>
  );
}

export { RibbonReady, RibbonWin, RibbonLoss, RibbonPlaying };