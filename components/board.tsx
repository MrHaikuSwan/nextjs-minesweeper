"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Cell, { CellState, DisplayState } from "./cell";

export default function Board({
  rows,
  cols,
  mines,
  winCallback,
  loseCallback,
}: {
  rows: number;
  cols: number;
  mines: number;
  winCallback: () => void;
  loseCallback: () => void;
}) {
  const [boardStates, setBoardStates] = useState<CellState[][]>(
    Array.from({ length: rows }, (e) =>
      Array(cols).fill({ displayState: "hidden", mineCount: 0, isMine: false })
    )
  );
  const [hasBeenClicked, setHasBeenClicked] = useState<boolean>(false);

  // Win condition: all non-mines are visible (not [any non-mines are non-visible])
  // Lose condition: any mines are visible
  useEffect(() => {
    if (boardStates.length != rows) {
      return;
    }
    let playerWon = true;
    let playerLost = false;
    for (let r = 0; r < rows; ++r) {
      for (let c = 0; c < cols; ++c) {
        const { isMine } = boardStates[r][c];
        const { displayState } = boardStates[r][c];
        if (isMine && displayState === "visible") {
          playerLost = true;
        } else if (!isMine && displayState !== "visible") {
          playerWon = false;
        }
      }
    }
    if (playerLost) {
      loseCallback();
    } else if (playerWon) {
      winCallback();
    }
  }, [boardStates]);

  const cells = Array.from({ length: rows }, (e) => Array(cols).fill(null));
  for (let r = 0; r < boardStates.length; ++r) {
    for (let c = 0; c < boardStates[r].length; ++c) {
      const cellState = boardStates[r][c];
      const { displayState } = cellState;
      const firstClickCallback = !hasBeenClicked
        ? () => {
            // Place mines after first click
            setBoardStates((boardStates) => {
              return placeBoardMines({
                rows,
                cols,
                mines,
                firstClick: { row: r, col: c },
                boardStates,
              });
            });
            setHasBeenClicked(true);
          }
        : () => {};

      cells[r][c] = (
        <Cell
          key={`${r}${c}`}
          cellState={cellState}
          revealCallback={(cellState: DisplayState) => {
            if (cellState === "hidden") {
              revealCells(r, c, setBoardStates);
            }
          }}
          toggleFlagCallback={() => {
            if (displayState === "hidden") {
              setSingleCellDisplayState(r, c, "flagged", setBoardStates);
            } else if (displayState === "flagged") {
              setSingleCellDisplayState(r, c, "hidden", setBoardStates);
            }
          }}
          firstClickCallback={firstClickCallback}
        />
      );
    }
  }

  return (
    <div className="w-full h-full flex flex-col flex-1 gap-1">
      {cells.map((row, index) => (
        <div key={index} className="w-full grow flex flex-row flex-1 gap-1">
          {row}
        </div>
      ))}
    </div>
  );
}

type Click = {
  row: number;
  col: number;
};

// Places mines using a Las Vegas algorithm
function placeBoardMines({
  boardStates,
  rows,
  cols,
  mines,
  firstClick,
}: {
  boardStates: CellState[][];
  rows: number;
  cols: number;
  mines: number;
  firstClick?: Click;
}) {
  const boardCounts: number[][] = Array.from({ length: rows }, (e) =>
    Array(cols).fill(0)
  );
  const boardMines: boolean[][] = Array.from({ length: rows }, (e) =>
    Array(cols).fill(false)
  );

  // Place fake mines in 3x3 box around first click
  if (firstClick) {
    boardMines[firstClick.row][firstClick.col] = true;
    for (let tr = firstClick.row - 1; tr <= firstClick.row + 1; ++tr) {
      for (let tc = firstClick.col - 1; tc <= firstClick.col + 1; ++tc) {
        if (tr >= 0 && tc >= 0 && tr < rows && tc < cols) {
          boardMines[tr][tc] = true;
        }
      }
    }
  }

  // Place all real mines, update boardCounts of all neighboring cells
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(rows * Math.random());
    const c = Math.floor(cols * Math.random());
    if (boardMines[r][c] == false) {
      minesPlaced++;
      boardMines[r][c] = true;
      for (let tr = r - 1; tr <= r + 1; ++tr) {
        for (let tc = c - 1; tc <= c + 1; ++tc) {
          if (tr >= 0 && tc >= 0 && tr < rows && tc < cols) {
            boardCounts[tr][tc]++;
          }
        }
      }
    }
  }

  // Remove fake mines placed from first clicks
  if (firstClick) {
    boardMines[firstClick.row][firstClick.col] = false;
    for (let tr = firstClick.row - 1; tr <= firstClick.row + 1; ++tr) {
      for (let tc = firstClick.col - 1; tc <= firstClick.col + 1; ++tc) {
        if (tr >= 0 && tc >= 0 && tr < rows && tc < cols) {
          boardMines[tr][tc] = false;
        }
      }
    }
  }

  // Construct CellState array
  const newBoardStates: CellState[][] = Array.from({ length: rows }, (e) =>
    Array(cols).fill(undefined)
  );
  for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c) {
      boardStates[r][c] = {
        mineCount: boardCounts[r][c],
        isMine: boardMines[r][c],
        displayState: boardStates[r][c].displayState,
      };
    }
  }

  return boardStates;
}

// Implementation of zero-spreading algorithm
function revealCells(
  row: number,
  col: number,
  setBoardStates: Dispatch<SetStateAction<CellState[][]>>
) {
  setBoardStates((boardStates: CellState[][]) => {
    let nextBoardStates = [...boardStates];
    let stack = [[row, col]];
    const rows = boardStates.length;
    const cols = boardStates[0].length;
    while (stack.length > 0) {
      let [r, c] = stack.pop()!;
      nextBoardStates[r][c].displayState = "visible";
      if (boardStates[r][c].mineCount !== 0) {
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
          if (nextBoardStates[tr][tc].displayState === "hidden") {
            stack.push([tr, tc]);
          }
        }
      }
    }
    return nextBoardStates;
  });
}

function setSingleCellDisplayState(
  row: number,
  col: number,
  newDisplayState: DisplayState,
  setBoardStates: Dispatch<SetStateAction<CellState[][]>>
) {
  setBoardStates((boardStates: CellState[][]) =>
    boardStates.map((rowStates, r) =>
      rowStates.map((cellState, c) =>
        row === r && col === c
          ? { ...cellState, displayState: newDisplayState }
          : cellState
      )
    )
  );
}
