export const getCodeFromPosition = (position) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD'];

    return `${letters[position.y]}${position.x + 1}`;
}

export const getCodeFromPositions = (positions) => {
    return positions.map(position => getCodeFromPosition(position));
}

export const randomNumberBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const arePositionEquals = (positionA, positionB) =>
    positionA.x === positionB.x
    && positionA.y === positionB.y