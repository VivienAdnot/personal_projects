import { config } from '../../config';
import { HIDDEN, MARKED } from './constants';
import { arePositionEquals } from './utils';

export const getNeighbors = (position) => {
    const isOutOfBounds = (surroundingCandidatePosition) => {
        return (
            surroundingCandidatePosition.x < 0
            || surroundingCandidatePosition.x > (config.rowsLength - 1)
            || surroundingCandidatePosition.y < 0
            || surroundingCandidatePosition.y > (config.columnsLength - 1)
        );
    }

    const surroundingCandidatePositions = [
        // upper row
        {
            x: position.x - 1,
            y: position.y - 1
        },
        {
            x: position.x,
            y: position.y - 1
        },
        {
            x: position.x + 1,
            y: position.y - 1
        },
        // middle row
        {
            x: position.x - 1,
            y: position.y
        },
        {
            x: position.x + 1,
            y: position.y
        },
        // lower row
        {
            x: position.x - 1,
            y: position.y + 1
        },
        {
            x: position.x,
            y: position.y + 1
        },
        {
            x: position.x + 1,
            y: position.y + 1
        }
    ];

    return surroundingCandidatePositions
    .filter(candidatePosition => !isOutOfBounds(candidatePosition));
}

export const getNeighborsHidden = (board, position) => {
    return getNeighbors(position)
        .filter(neighbor => {
            return board[neighbor.x][neighbor.y].visibility === HIDDEN;
        });
};

const getNeighborsEmpty = (board, position) => {
    return getNeighbors(position)
        .filter(neighbor => {
            return board[neighbor.x][neighbor.y].value === 0;
        });
};

export const getNeighborsMarked = (board, position) => {
    return getNeighbors(position)
        .filter(neighbor => {
            return board[neighbor.x][neighbor.y].visibility === MARKED;
        });
};

// recursive
// this takes a position in imput, and a collection of discovered empty squares
// and it returns empty squares only
export const getAllNeighborEmptyPositions = (board, position, discoveredEmptyNeightbors = []) => {
    if (!discoveredEmptyNeightbors.length) {
        discoveredEmptyNeightbors.push(position);
    }

    let nextNewEmptyHiddenNeighbors = getNeighborsEmpty(board, position)
        // find only hidden empty squares in the box around our current position
        .filter(neighborPosition => {
            return board[neighborPosition.x][neighborPosition.y].visibility === HIDDEN
        })
        // exclude squares that are already discovered
        .filter(neighborPosition => {
            return !discoveredEmptyNeightbors.some(knownPosition => {
                return arePositionEquals(knownPosition, neighborPosition);
            });
        });

    // stop if if we didn't add any more square
    if (!nextNewEmptyHiddenNeighbors.length) {
        console.log('no new empty hidden neighbor, stop')
        return discoveredEmptyNeightbors;
    }

    // concat
    discoveredEmptyNeightbors.push(...nextNewEmptyHiddenNeighbors);

    // here comes the recursion
    for (let newNeighbor of nextNewEmptyHiddenNeighbors) {
        let next = getAllNeighborEmptyPositions(board, newNeighbor, discoveredEmptyNeightbors);
        discoveredEmptyNeightbors = [...next];
    }

    return discoveredEmptyNeightbors;
}

// we receive in input a set of empty squares
// and we return in output the empty squares, and their direct neighbors
export const getEmptyZoneNextNeighbours = (board, emptyZone) => {
    // console.log('getEmptyZoneNextNeighbours emptyZone input', emptyZone);
    let positionsToDisplay = emptyZone;
    let numberPositionsDiscovered = []

    for (let knownEmptyPosition of positionsToDisplay) {
        // console.log('knownEmptyPosition', knownEmptyPosition);

        // we can get all the neighbor because current position is an empty square
        // that means, no nomb exist in the neighbors
        let numberHiddenNeighbours = getNeighborsHidden(board, knownEmptyPosition)
            .filter(numberHiddenNeighbour => {
                // exclude already known square from empty zone
                return !positionsToDisplay.some(knownPosition => {
                    return arePositionEquals(knownPosition, numberHiddenNeighbour);
                })
                // exclude already known square from discovered numbers
                && !numberPositionsDiscovered.some(numberPosition => {
                    return arePositionEquals(numberPosition, numberHiddenNeighbour);
                });
            });
        // console.log('numberHiddenNeighbours', numberHiddenNeighbours);

        numberPositionsDiscovered.push(...numberHiddenNeighbours);
    }

    positionsToDisplay.push(...numberPositionsDiscovered);
    // console.log('getEmptyZoneNextNeighbours emptyZone output', positionsToDisplay);
    return positionsToDisplay;
}