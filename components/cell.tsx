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
      className="h-full grow bg-stone-300 flex justify-center items-center rounded-sm md:rounded-md border-2"
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
  return (
    <div className="w-16 h-16 flex items-center justify-center">
      <svg
        className="w-12 h-12"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2h4v60h-4V2z" fill="#6e7a80" />
        <path d="M16 14h32l-12 8 12 8H16z" fill="#d23f31" />
      </svg>
    </div>
  );
}

function Mine() {
  return (
    <div className="w-20 h-20 flex items-center justify-center">
      <svg
        className="w-16 h-16"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="32" r="14" fill="#000000" />
        <line x1="32" y1="6" x2="32" y2="16" stroke="#000000" strokeWidth="2" />
        <line
          x1="32"
          y1="48"
          x2="32"
          y2="58"
          stroke="#000000"
          strokeWidth="2"
        />
        <line x1="6" y1="32" x2="16" y2="32" stroke="#000000" strokeWidth="2" />
        <line
          x1="48"
          y1="32"
          x2="58"
          y2="32"
          stroke="#000000"
          strokeWidth="2"
        />
        <line
          x1="45.25"
          y1="18.75"
          x2="38.75"
          y2="25.25"
          stroke="#000000"
          strokeWidth="2"
        />
        <line
          x1="25.25"
          y1="38.75"
          x2="18.75"
          y2="45.25"
          stroke="#000000"
          strokeWidth="2"
        />
        <line
          x1="18.75"
          y1="18.75"
          x2="25.25"
          y2="25.25"
          stroke="#000000"
          strokeWidth="2"
        />
        <line
          x1="38.75"
          y1="38.75"
          x2="45.25"
          y2="45.25"
          stroke="#000000"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function MineCount({ count }: { count: number }) {
  const countColorMap: Record<number, string> = {
    1: "text-blue-500",
    2: "text-green-500",
    3: "text-red-500",
    4: "text-purple-500",
    5: "text-yellow-500",
    6: "text-pink-500",
    7: "text-gray-500",
    8: "text-black",
  };
  return (
    <span className={`text-black text-5xl font-medium ${countColorMap[count]}`}>
      {count}
    </span>
  );
}
