const rowsLength = 16;
const columnsLength = 30;
const bombAmount = 99;

export const config = {
  title: "Minesweeper",
  drawerWidth: 350,
  rowsLength,
  columnsLength,
  bombAmount,
  squaresSum: rowsLength * columnsLength,
  numberSquaresSum: rowsLength * columnsLength - bombAmount
};

export const _ = undefined;
