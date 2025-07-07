import { getNeighbors } from './accessors';
import { config } from '../../config';
import { HIDDEN, BOMB } from './constants';
import { randomNumberBetween, arePositionEquals } from './utils';

const isPositionBomb = (bombPositions, targetPosition) => bombPositions.some(
    bombPosition => arePositionEquals(bombPosition, targetPosition)
);

const countNeighborBombPositions = (bombPositions, position) => {

    return getNeighbors(position)
    .filter(neighborPosition => isPositionBomb(bombPositions, neighborPosition))
    .length;

};

export const buildBombPositions = (startPosition) => {
    let bombPositions = [];
    const startPositionNeighbors = getNeighbors(startPosition);
    const forbiddenPositions = [startPosition, ...startPositionNeighbors];

    while (bombPositions.length !== config.bombAmount) {

        let newBombPosition = {
            x: randomNumberBetween(0, config.rowsLength - 1),
            y: randomNumberBetween(0, config.columnsLength -1)
        };

        if (
            !isPositionBomb(bombPositions, newBombPosition)
            && !forbiddenPositions.some(
                forbiddenPosition => arePositionEquals(newBombPosition, forbiddenPosition)
            )) {

            bombPositions.push(newBombPosition);

        }

    }

    return bombPositions;

};

export const buildBoard = (bombPositions) => {

    return Array.from({length: config.rowsLength}, (value, x) => {
        return Array.from({length: config.columnsLength}, (value, y) => {
            const currentPosition = {x, y};
            return {
                position: currentPosition,
                value: (isPositionBomb(bombPositions, currentPosition)
                    ? BOMB
                    : countNeighborBombPositions(bombPositions, currentPosition)
                ),
                visibility: HIDDEN
            };
        });
    });
};

// you need to build another map before showing it again
export const clearBoard = () => {
    return Array.from({length: config.rowsLength}, (value, x) => {
        return Array.from({length: config.columnsLength}, (value, y) => {
            return {
                position: {x, y},
                value: 'X',
                visibility: HIDDEN
            };
        });
    });
}