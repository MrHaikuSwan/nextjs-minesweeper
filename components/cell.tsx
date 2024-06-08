"use client";

export type DisplayState = "hidden" | "flagged" | "visible";

interface CellProps {
  mineCount: number;
  displayState: DisplayState;
  revealCallback: (arg0: DisplayState) => void;
  toggleFlagCallback: () => void;
}

export default function Cell({
  mineCount,
  displayState,
  revealCallback,
  toggleFlagCallback,
}: CellProps) {
  const isMine = mineCount === -1;

  return (
    <div
      onClick={() => revealCallback(displayState)}
      onContextMenu={(e) => {
        e.preventDefault();
        toggleFlagCallback();
      }}
      className="bg-stone-300 w-20 h-20 flex justify-center items-center rounded-lg border-2"
    >
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
