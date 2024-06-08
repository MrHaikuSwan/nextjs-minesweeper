import Board from "@/components/board";

export default function Home() {
  const rows = 8;
  const cols = 8;
  const mines = 1;

  return (
    <main>
      <Board rows={rows} cols={cols} mines={mines} />
    </main>
  );
}
