import { useState } from "react";
import Cell from "./cell";

export default function Board({
  rows,
  cols,
  mines,
}: {
  rows: number;
  cols: number;
  mines: number;
}) {
  const [boardCounts, setBoardCounts] = useState(
    initBoardCounts(rows, cols, mines)
  );
  const [boardStates, setBoardStates] = useState(
    Array(rows).fill(Array(cols).fill("hidden"))
  );

  const cells = Array(rows).fill(Array(cols).fill(undefined));

  for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c) {
      cells[r][c] = (
        <Cell
          mineCount={boardCounts[r][c]}
          displayState={boardStates[r][c]}
          revealCallback={() => revealCell(r, c, setBoardStates)}
        />
      );
    }
  }

  return (
    <div>
      {cells.map((row) => (
        <div>{row}</div>
      ))}
    </div>
  );
}

function initBoardCounts(rows: number, cols: number, mines: number) {
  const boardCounts = Array(rows).fill(Array(cols).fill(0));
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(rows * Math.random());
    const c = Math.floor(cols * Math.random());
    if (boardCounts[r][c] !== -1) {
      boardCounts[r][c] = -1;
      for (let tr = r - 1; tr <= r + 1; ++tr) {
        for (let tc = c - 1; tc <= c + 1; ++tc) {
          if (
            tr >= 0 &&
            tc >= 0 &&
            tr < rows &&
            tc < cols &&
            boardCounts[tr][tc] !== -1
          ) {
            boardCounts[tr][tc]++;
          }
        }
      }
      minesPlaced++;
    }
  }
  return boardCounts;
}

function revealCell(row: number, col: number, setBoardStates: Function) {}
