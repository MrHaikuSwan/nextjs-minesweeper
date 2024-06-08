"use client";

import { useEffect, useState } from "react";
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
  const [boardCounts, setBoardCounts] = useState<number[][]>([[]]);

  useEffect(() => {
    setBoardCounts(initBoardCounts(rows, cols, mines));
  }, []);

  const [boardStates, setBoardStates] = useState(
    Array.from({ length: rows }, (e) => Array(cols).fill("hidden"))
  );

  const cells = Array.from({ length: rows }, (e) => Array(cols).fill(null));
  for (let r = 0; r < boardCounts.length; ++r) {
    for (let c = 0; c < boardCounts[r].length; ++c) {
      cells[r][c] = (
        <Cell
          key={`${r}${c}`}
          mineCount={boardCounts[r][c]}
          displayState={boardStates[r][c]}
          revealCallback={() => revealCell(r, c, setBoardStates)}
        />
      );
    }
  }

  return (
    <div className="flex flex-col gap-1 justify-between">
      {cells.map((row, index) => (
        <div className="flex flex-row gap-1 justify-between" key={index}>
          {row}
        </div>
      ))}
    </div>
  );
}

function initBoardCounts(rows: number, cols: number, mines: number) {
  const boardCounts = Array.from({ length: rows }, (e) => Array(cols).fill(0));
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(rows * Math.random());
    const c = Math.floor(cols * Math.random());
    console.log(r, c, boardCounts[r][c]);
    if (boardCounts[r][c] !== -1) {
      minesPlaced++;
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
    }
  }

  return boardCounts;
}

function revealCell(row: number, col: number, setBoardStates: Function) {}
