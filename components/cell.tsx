"use client";

interface CellProps {
  mineCount: number;
  displayState: "hidden" | "flagged" | "visible";
  revealCallback: () => void;
  debug: string; // TODO: remove
}

export default function Cell({
  mineCount,
  displayState,
  revealCallback,
  debug,
}: CellProps) {
  const isMine = mineCount === -1;

  return (
    <div onClick={revealCallback}>
      {displayState === "hidden" && debug}
      {displayState === "flagged" && <Flag />}
      {displayState === "visible" &&
        (isMine ? <Mine /> : <MineCount count={mineCount} />)}
    </div>
  );
}

function Flag() {
  return <span>Flag</span>;
}

function Mine() {
  return <span>Mine</span>;
}

function MineCount({ count }: { count: number }) {
  return <span>{count}</span>;
}
