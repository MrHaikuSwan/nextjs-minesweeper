import Board from "@/components/board";

export default function Home() {
  const rows = 8;
  const cols = 8;
  const mines = 2;

  return (
    // <main className="flex flex-row min-h-screen justify-center items-center">
    //   <div className="p-4 max-w-full">
    //     <Board rows={rows} cols={cols} mines={mines} />
    //   </div>
    // </main>

    // <main className="flex flex-row min-h-screen justify-center items-center">
    //   <div className="p-4 max-w-full">
    //   </div>
    // </main>
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-1/2 aspect-square">
        <Board rows={rows} cols={cols} mines={mines} />
      </div>
    </div>
  );
}
