import { useState } from "react";
import Board from "./board";

export default function Game() {
  const rows = 8;
  const cols = 8;
  const mines = 10;

  return <Board rows={rows} cols={cols} mines={mines} />;
}
