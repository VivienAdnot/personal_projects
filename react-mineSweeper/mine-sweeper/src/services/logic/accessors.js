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

// heavy

export const getAllNeighborEmptyPositions = (board, position, knownEmptyPositions = []) => {

    if (!knownEmptyPositions.length) {

        knownEmptyPositions.push(position);

    }

    let nextUnknownEmptyPositions = getNeighborsEmpty(board, position)
    .filter(neighborPosition => {
        return board[neighborPosition.x][neighborPosition.y].visibility === HIDDEN
    })
    .filter(neighborPosition => {

        return !knownEmptyPositions.some(knownPosition => {

            return arePositionEquals(knownPosition, neighborPosition);

        });

    });

    if (!nextUnknownEmptyPositions.length) {
        return knownEmptyPositions;
    }

    knownEmptyPositions.push(...nextUnknownEmptyPositions);

    for (let emptyPosition of nextUnknownEmptyPositions) {

        let next = getAllNeighborEmptyPositions(board, emptyPosition, knownEmptyPositions);
        knownEmptyPositions = [...next];
    }

    return knownEmptyPositions;
}

export const getEmptyZoneNextNeighbours = (board, emptyZone) => {

    let positionsToDisplay = emptyZone;
    let numberPositionsDiscovered = []

    for (let knownEmptyPosition of positionsToDisplay) {

        let numberHiddenNeighbours = getNeighborsHidden(board, knownEmptyPosition)
        .filter(numberHiddenNeighbour => {

            return !positionsToDisplay.some(knownPosition => {

                return arePositionEquals(knownPosition, numberHiddenNeighbour);

            }) && !numberPositionsDiscovered.some(numberPosition => {

                return arePositionEquals(numberPosition, numberHiddenNeighbour);

            });

        });

        numberPositionsDiscovered.push(...numberHiddenNeighbours);

    }

    positionsToDisplay.push(...numberPositionsDiscovered);
    return positionsToDisplay;
}