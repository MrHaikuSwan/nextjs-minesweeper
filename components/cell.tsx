"use client";

export type DisplayState = "hidden" | "flagged" | "visible";

interface CellProps {
  mineCount: number;
  displayState: DisplayState;
  revealCallback: (arg0: DisplayState) => void;
  toggleFlagCallback: () => void;
  className: string;
}

export default function Cell({
  mineCount,
  displayState,
  revealCallback,
  toggleFlagCallback,
  className,
}: CellProps) {
  const isMine = mineCount === -1;

  return (
    <div
      onClick={() => revealCallback(displayState)}
      onContextMenu={(e) => {
        e.preventDefault();
        toggleFlagCallback();
      }}
      className={className}
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
