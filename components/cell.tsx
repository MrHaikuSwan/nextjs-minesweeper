"use client";

export type DisplayState = "hidden" | "flagged" | "visible";
export type CellState = {
  mineCount: number;
  isMine: boolean;
  displayState: DisplayState;
};

export default function Cell({
  cellState,
  revealCallback,
  toggleFlagCallback,
  firstClickCallback,
}: {
  cellState: CellState;
  revealCallback: (arg0: DisplayState) => void;
  toggleFlagCallback: () => void;
  firstClickCallback: () => void;
}) {
  const { mineCount, isMine, displayState } = cellState;

  return (
    <div
      onClick={() => {
        firstClickCallback();
        revealCallback(displayState);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        toggleFlagCallback();
      }}
      className="h-full grow bg-stone-300 text-black flex justify-center items-center rounded-sm md:rounded-md border-2"
    >
      <div className="absolute">
        {displayState === "flagged" && <Flag />}
        {displayState === "visible" &&
          (isMine ? <Mine /> : <MineCount count={mineCount} />)}
      </div>
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
