"use client";

import { useEffect, useState } from "react";
import Cell, { DisplayState } from "./cell";
import { closeSync } from "fs";

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

  const [boardStates, setBoardStates] = useState<DisplayState[][]>(
    Array.from({ length: rows }, (e) => Array(cols).fill("hidden"))
  );

  useEffect(() => {
    setBoardCounts(initBoardCounts(rows, cols, mines));
  }, []);

  // Win condition: all non-mines are visible (not [any non-mines are non-visible])
  // Lose condition: any mines are visible
  useEffect(() => {
    if (boardCounts.length != rows) {
      return;
    }
    let playerWon = true;
    let playerLost = false;
    for (let r = 0; r < rows; ++r) {
      for (let c = 0; c < cols; ++c) {
        const count = boardCounts[r][c];
        const state = boardStates[r][c];
        if (count === -1 && state === "visible") {
          playerLost = true;
        } else if (count !== -1 && state !== "visible") {
          playerWon = false;
        }
      }
    }
    if (playerLost) {
      alert("You Lose.");
    } else if (playerWon) {
      alert("You Win!");
    }
  }, [boardStates]);

  const cells = Array.from({ length: rows }, (e) => Array(cols).fill(null));
  for (let r = 0; r < boardCounts.length; ++r) {
    for (let c = 0; c < boardCounts[r].length; ++c) {
      const mineCount = boardCounts[r][c];
      const displayState = boardStates[r][c];
      cells[r][c] = (
        <Cell
          // className={`fixed bg-stone-300 w-[12.5%] aspect-square flex justify-center items-center rounded-lg border-2`}
          className="h-full grow bg-stone-300 flex justify-center items-center rounded-sm md:rounded-md border-2"
          key={`${r}${c}`}
          mineCount={mineCount}
          displayState={displayState}
          revealCallback={(cellState: DisplayState) => {
            if (cellState === "hidden") {
              revealCells(r, c, boardCounts, setBoardStates);
            }
          }}
          toggleFlagCallback={() => {
            if (displayState === "hidden") {
              setSingleCellState(r, c, "flagged", setBoardStates);
            } else if (displayState === "flagged") {
              setSingleCellState(r, c, "hidden", setBoardStates);
            }
          }}
        />
      );
    }
  }

  // return cells;

  return (
    <div className="w-full h-full flex flex-col flex-1 gap-1">
      {cells.map((row, index) => (
        <div key={index} className="w-full grow flex flex-row flex-1 gap-1">
          {row}
        </div>
      ))}
    </div>

    // <div className="w-full h-full bg-lime-700 flex flex-col flex-1">
    //   <div className="w-full border grow flex flex-row flex-1">
    //     <div className="h-full border grow"></div>
    //     <div className="h-full border grow"></div>
    //     <div className="h-full border grow"></div>
    //     <div className="h-full border grow"></div>
    //     <div className="h-full border grow"></div>
    //     <div className="h-full border grow"></div>
    //     <div className="h-full border grow"></div>
    //     <div className="h-full border grow"></div>
    //   </div>
    //   <div className="w-full border grow"></div>
    //   <div className="w-full border grow"></div>
    //   <div className="w-full border grow"></div>
    //   <div className="w-full border grow"></div>
    //   <div className="w-full border grow"></div>
    //   <div className="w-full border grow"></div>
    //   <div className="w-full border grow"></div>
    // </div>
  );

  // <div className="flex flex-col gap-1 justify-between">
  //   {cells.map((row, index) => (
  //     <div className="flex flex-row gap-1 justify-between" key={index}>
  //       {row}
  //     </div>
  //   ))}
  // </div>
  // );
}

function initBoardCounts(rows: number, cols: number, mines: number) {
  const boardCounts = Array.from({ length: rows }, (e) => Array(cols).fill(0));
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(rows * Math.random());
    const c = Math.floor(cols * Math.random());
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

function revealCells(
  row: number,
  col: number,
  boardCounts: number[][],
  setBoardStates: Function
) {
  setBoardStates((boardStates: DisplayState[][]) => {
    let nextBoardStates = [...boardStates];
    let stack = [[row, col]];
    const rows = boardStates.length;
    const cols = boardStates[0].length;
    while (stack.length > 0) {
      let [r, c] = stack.pop()!;
      nextBoardStates[r][c] = "visible";
      if (boardCounts[r][c] !== 0) {
        continue;
      }
      for (let tr = r - 1; tr <= r + 1; ++tr) {
        for (let tc = c - 1; tc <= c + 1; ++tc) {
          if (tr < 0 || tr >= rows || tc < 0 || tc >= cols) {
            continue;
          }
          if (tr === r && tc === c) {
            continue;
          }
          if (nextBoardStates[tr][tc] === "hidden") {
            stack.push([tr, tc]);
          }
        }
      }
    }
    return nextBoardStates;
  });
}

function setSingleCellState(
  row: number,
  col: number,
  newDisplayState: DisplayState,
  setBoardStates: Function
) {
  setBoardStates((boardStates: DisplayState[][]) =>
    boardStates.map((rowStates, r) =>
      rowStates.map((cellState, c) =>
        row === r && col === c ? newDisplayState : cellState
      )
    )
  );
}
