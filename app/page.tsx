import Board from "@/components/board";

export default function Home() {
  const rows = 8;
  const cols = 8;
  const mines = 10;

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-4/5 md:w-1/2 aspect-square">
        <Board rows={rows} cols={cols} mines={mines} />
      </div>
    </div>
  );
}
