"use client";

import { useState } from "react";
import Board from "./board";

type GameState = "playing" | "won" | "lost";

export default function Game() {
  const [gameState, setGameState] = useState<GameState>("playing");
  const [resetBoardFlag, setResetBoardFlag] = useState(false);

  const rows = 8;
  const cols = 8;
  const mines = 10;

  return (
    <main>
      {gameState !== "playing" && (
        <EndGameModal
          gameState={gameState}
          onPlayAgain={() => {
            setResetBoardFlag(!resetBoardFlag);
            setGameState("playing");
          }}
        />
      )}
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="w-4/5 md:w-1/2 aspect-square">
          <Board
            key={`${resetBoardFlag}`}
            rows={rows}
            cols={cols}
            mines={mines}
            winCallback={() => {
              setGameState("won");
            }}
            loseCallback={() => {
              setGameState("lost");
            }}
          />
        </div>
      </div>
    </main>
  );
}

function EndGameModal({
  gameState,
  onPlayAgain,
}: {
  gameState: GameState;
  onPlayAgain: () => void;
}) {
  return (
    <div className="z-10 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-stone-300 bg-opacity-90 rounded-lg p-8 text-center">
        <h1
          className={`text-4xl mb-6 ${
            gameState === "won" ? "text-green-700" : "text-red-700"
          }`}
        >
          {gameState === "won" ? "You Win!" : "You Lose!"}
        </h1>
        <button
          className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={onPlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
