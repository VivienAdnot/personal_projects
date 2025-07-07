import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Hub } from 'aws-amplify';

import AuthModalOpener from '../Auth/ModalOpener.jsx';
import { RibbonReady, RibbonWin, RibbonLoss, RibbonPlaying } from './Ribbons';
import Square from './Square.jsx';
import {
    buildBombPositions,
    buildBoard,
    clearBoard
} from '../../services/logic/createMap';
import {
    getNeighborsHidden,
    getNeighborsMarked,
    getAllNeighborEmptyPositions,
    getEmptyZoneNextNeighbours
} from '../../services/logic/accessors';
import { HIDDEN, VISIBLE, MARKED, BOMB } from '../../services/logic/constants';
import { config } from '../../config';

import '../../style/Game.css';

export const GAME_READY = 0;
export const GAME_PLAYING = 1;
export const GAME_WIN = 2;
export const GAME_LOSS = 3;

const initialInternals = () => ({
    positionLost: null,
    interval: null,
    bombs: []
});

// it's useless to use a function here, but i want to keep consistency with startGameInitialState
const initialState = () => ({
    gameStatus: GAME_READY,
    timer: 0,
    board: clearBoard()
});

// interval must be set manually
const startGameInternals = (startPosition) => ({
    positionLost: null,
    bombs: buildBombPositions(startPosition)
});

const startGameState = (bombs) => ({
    gameStatus: GAME_PLAYING,
    timer: 0,
    board: buildBoard(bombs)
});

class Game extends Component {
    constructor(props) {
        super(props);

        this.internals = {
            ...initialInternals()
        };

        this.state = {
            ...initialState()
        };
    }

    startGame = (startPosition, callback) => {
        this.internals = {
            ...startGameInternals(startPosition),
            interval: setInterval(() => {
                this.setState((prevState) => ({
                    timer: prevState.timer + 1
                }))
            }, 1000)
        };

        this.setState({
            ...startGameState(this.internals.bombs)
        }, callback);
    }

    resetGame = () => {
        Hub.dispatch('Game', { event: 'start'});
        clearInterval(this.internals.interval);

        this.internals = {
            ...initialInternals()
        };

        this.setState({
            ...initialState()
        });
        
    }

    markAllBombs = () => {
        this.setState((prevState) => {
            this.internals.bombs.forEach((bomb) => {
                prevState.board[bomb.x][bomb.y].visibility = MARKED;
            });

            return {
                board: prevState.board
            }
        });
    }

    revealMap = (lostPosition) => {
        this.setState((prevState) => {
            this.internals.bombs.forEach((bomb) => {
                prevState.board[bomb.x][bomb.y].visibility = VISIBLE;
            });

            return {
                board: prevState.board
            }
        })
    }

    onSquareLeftClick = (positionClicked, value, visibility) => {
        // console.log('left click triggered');
        const action = (isFirstClick = false) => {
            if (visibility !== HIDDEN) return;

            if (isFirstClick) {
                value = this.state.board[positionClicked.x][positionClicked.y].value;
            }

            let positionsToDisplay = [positionClicked];

            if (value === 0) {
                positionsToDisplay = getAllNeighborEmptyPositions(this.state.board, positionClicked);
                positionsToDisplay = getEmptyZoneNextNeighbours(this.state.board, positionsToDisplay);
                // console.log('left click empty zone', positionsToDisplay.length, positionsToDisplay);
            }

            this.setState((prevState) => {
                positionsToDisplay.forEach((positionToDisplay) => {
                    prevState.board[positionToDisplay.x][positionToDisplay.y].visibility = VISIBLE;
                });

                return {
                    board: prevState.board
                }
            }, () => {
                const gameStatus = this.computeGameStatus();

                if (gameStatus === GAME_LOSS) {
                    this.onLoss(positionClicked);
                } else if (gameStatus === GAME_WIN) {
                    this.onWin();
                }
            });
        };

        if (this.state.gameStatus === GAME_READY) {
            this.startGame(positionClicked, () => action(true));
        } else {
            action();
        }
    }

    onSquareRightClick = (position) => {
        this.setState((prevState) => {
            switch(prevState.board[position.x][position.y].visibility) {
                case HIDDEN:
                    prevState.board[position.x][position.y].visibility = MARKED;
                    return {
                        map: prevState.board
                    }
                case MARKED:
                    prevState.board[position.x][position.y].visibility = HIDDEN;
                    return {
                        map: prevState.board
                    }
                default:
                    return null;
            }
        });
    }

    onSquareDoubleClick = (position) => {
        let targetValue = this.state.board[position.x][position.y].value;

        const isAllowed = (position) => {
            const neighborMarkedPositions = getNeighborsMarked(this.state.board, position);
            return targetValue === neighborMarkedPositions.length;
        };

        if (!isAllowed(position)) {
            return;
        }

        // retrieve all the hidden neighbors, all kind
        let positionsToDisplay = getNeighborsHidden(this.state.board, position);

        // retain only the empty neighbors
        let emptyNeighborPositions = positionsToDisplay
            .filter(neighborPosition => {
                return this.state.board[neighborPosition.x][neighborPosition.y].value === 0;
            });

        // if any neighbors
        if (emptyNeighborPositions.length) {
            // get all the other empty squares (extended neighbors)
            emptyNeighborPositions = getAllNeighborEmptyPositions(
                this.state.board,
                emptyNeighborPositions[0],
                []);

            const emptyZone = getEmptyZoneNextNeighbours(this.state.board, emptyNeighborPositions);

            positionsToDisplay.push(...emptyZone);
        }

        this.setState((prevState) => {
            positionsToDisplay.forEach((positionToDisplay) => {
                prevState.board[positionToDisplay.x][positionToDisplay.y].visibility = VISIBLE;
            });

            return {
                board: prevState.board
            }
        }, () => {
            const gameStatus = this.computeGameStatus();

            if (gameStatus === GAME_LOSS) {
                this.onLoss(position);
            } else if (gameStatus === GAME_WIN) {
                this.onWin(position);
            }
        });
    }

    computeGameStatus = () => {
        const isBombRevealed = () => {
            return this.state.board.some((row) => {
                return row.some((squareInfo) => {
                    return squareInfo.value === 'B' && squareInfo.visibility === VISIBLE;
                });
            })
        }

        const areAllNumberSquaresDisplayed = () => {
            const visibleNumberSquares = this.state.board.reduce((acc, row) => {
                const visibleNumberSquaresPerRow = row.filter((square) => {
                    return square.value !== BOMB && square.visibility === VISIBLE;
                });

                return acc + visibleNumberSquaresPerRow.length;
            }, 0);

            return config.numberSquaresSum === visibleNumberSquares;
        };

        // shortcut for debug:
        if (this.props.winNext) {
            return GAME_WIN;
        }

        if (isBombRevealed()) {
            return GAME_LOSS;
        } else if (areAllNumberSquaresDisplayed()) {
            return GAME_WIN;
        }
        return GAME_PLAYING;
    }

    renderSquare(squareInfo) {
        const keyValue = squareInfo.position.x * this.state.board[0].length + squareInfo.position.y;

        const isPositionLost = this.internals.positionLost
            && squareInfo.position.x === this.internals.positionLost.x
            && squareInfo.position.y === this.internals.positionLost.y;

        const isBomb = squareInfo.value === 'B';

        const isClickable = this.state.gameStatus === GAME_READY || this.state.gameStatus === GAME_PLAYING;

        return (
            <Square
                key={keyValue}
                position={squareInfo.position}
                value={squareInfo.value}
                visibility={squareInfo.visibility}
                isPositionLost={isPositionLost}
                isBomb={isBomb}
                clickable={isClickable}
                onLeftClick={this.onSquareLeftClick}
                onRightClick={this.onSquareRightClick}
                onDblClick={this.onSquareDoubleClick}
                godMode={this.props.godMode}
            ></Square>
        );
    }

    onWin = () => {
        const score = this.state.timer;
        this.markAllBombs();

        Hub.dispatch('Game', { event: 'win', data: { score }});
        clearInterval(this.internals.interval);

        this.setState(() => ({
            gameStatus: GAME_WIN
        }));
    }

    onLoss = (position) => {
        this.revealMap(position);
        this.internals.positionLost = position;

        clearInterval(this.internals.interval);
        this.setState(() => ({
            gameStatus: GAME_LOSS
        }));
    }

    render() {
        let titleRibbon;
        if (this.state.gameStatus === GAME_WIN) {
            titleRibbon = <RibbonWin timer={this.state.timer} />;
        } else if (this.state.gameStatus === GAME_READY) {
            titleRibbon = <RibbonReady />;
        } else if (this.state.gameStatus === GAME_LOSS) {
            titleRibbon = <RibbonLoss />;
        } else {
            titleRibbon = <RibbonPlaying timer={this.state.timer}/>;
        }

        return (
            <div className="game container">
                {titleRibbon}
                <div className="game-board">
                    <div>
                    {
                        Array.from({length: config.rowsLength}, (value, x) => x)
                        .map(x => {
                            return (
                                <div key={x} className="board-row">
                                    {
                                        Array.from({length: config.columnsLength}, (value, y) => y).map(y => {
                                            const square = this.state.board[x][y];
                                            return this.renderSquare(square);
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                    </div>
                </div>

                <div className="result">
                    <Button variant="contained" className="play-again" onClick={this.resetGame}>
                        Restart game
                    </Button>
                </div>

                <AuthModalOpener />
            </div>
        );
    }
}

export default Game;