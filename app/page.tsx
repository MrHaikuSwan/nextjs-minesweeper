import Board from "@/components/board";

export default function Home() {
  const rows = 8;
  const cols = 8;
  const mines = 10;

  return (
    <main className="flex flex-row min-h-screen justify-center items-center">
      <Board rows={rows} cols={cols} mines={mines} />
    </main>
  );
}
