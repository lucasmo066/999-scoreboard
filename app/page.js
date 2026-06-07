"use client";

import { useMemo, useState } from "react";

const PLAYERS = [
  "Lucas",
  "Max",
  "Emily",
  "Dom",
  "Izzy",
  "Nathan",
  "Blake",
  "Wyatt",
  "Zach",
  "Val",
  "Grayson",
  "Mike",
];

const INNINGS = 9;
const CYCLE = ["empty", "green", "red"];

const CELL_DISPLAY = {
  empty: "⬜",
  green: "🟩",
  red: "🟥",
};

function nextCellState(current) {
  const index = CYCLE.indexOf(current);
  return CYCLE[(index + 1) % CYCLE.length];
}

function getPlayerStatus(cells) {
  if (cells.some((cell) => cell === "red")) return "Eliminated";
  if (cells.every((cell) => cell === "green")) return "Finished";
  return "Alive";
}

function createInitialScores() {
  return PLAYERS.map(() => Array(INNINGS).fill("empty"));
}

export default function Home() {
  const [scores, setScores] = useState(createInitialScores);
  const [currentInning, setCurrentInning] = useState(1);
  const [lastEliminated, setLastEliminated] = useState("—");

  function handleCellClick(playerIndex, inningIndex) {
    setScores((prev) => {
      const next = prev.map((row) => [...row]);
      const current = next[playerIndex][inningIndex];
      next[playerIndex][inningIndex] = nextCellState(current);

      const wasEliminated = prev[playerIndex].some((cell) => cell === "red");
      const isEliminated = next[playerIndex].some((cell) => cell === "red");

      if (!wasEliminated && isEliminated) {
        setLastEliminated(PLAYERS[playerIndex]);
      }

      return next;
    });
  }

  function decrementInning() {
    setCurrentInning((prev) => Math.max(1, prev - 1));
  }

  function incrementInning() {
    setCurrentInning((prev) => Math.min(INNINGS, prev + 1));
  }

  const champion = useMemo(() => {
    const finished = PLAYERS.filter(
      (_, index) => getPlayerStatus(scores[index]) === "Finished",
    );
    return finished.length > 0 ? finished.join(", ") : "—";
  }, [scores]);

  const hotDogHero = useMemo(() => {
    let bestName = "—";
    let bestCount = -1;

    PLAYERS.forEach((name, index) => {
      if (getPlayerStatus(scores[index]) === "Eliminated") return;

      const greenCount = scores[index].filter((cell) => cell === "green").length;
      if (greenCount > bestCount) {
        bestCount = greenCount;
        bestName = name;
      }
    });

    return bestCount > 0 ? bestName : "—";
  }, [scores]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <header className="bg-[#BD3039] px-6 py-5 text-center shadow-md">
        <h1 className="text-4xl font-black tracking-wide text-white md:text-5xl lg:text-6xl xl:text-7xl">
          ⚾ FENWAY PARK 9-9-9 CHALLENGE ⚾
        </h1>
      </header>

      <main className="flex flex-1 flex-col px-4 py-6 md:px-8 lg:px-12">
        <div className="mb-6 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={decrementInning}
            disabled={currentInning <= 1}
            className="flex h-16 w-16 items-center justify-center rounded-lg border-4 border-[#0C2E1F] bg-[#0C2E1F] text-4xl font-bold text-white transition hover:bg-[#0a2419] disabled:cursor-not-allowed disabled:opacity-40 md:h-20 md:w-20 md:text-5xl"
            aria-label="Previous inning"
          >
            −
          </button>

          <p className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Current Inning:{" "}
            <span className="text-[#BD3039]">{currentInning}</span>
          </p>

          <button
            type="button"
            onClick={incrementInning}
            disabled={currentInning >= INNINGS}
            className="flex h-16 w-16 items-center justify-center rounded-lg border-4 border-[#0C2E1F] bg-[#0C2E1F] text-4xl font-bold text-white transition hover:bg-[#0a2419] disabled:cursor-not-allowed disabled:opacity-40 md:h-20 md:w-20 md:text-5xl"
            aria-label="Next inning"
          >
            +
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-center">
            <thead>
              <tr className="border-b-4 border-[#0C2E1F] bg-[#0C2E1F] text-white">
                <th className="px-4 py-4 text-left text-2xl font-bold md:text-3xl lg:text-4xl">
                  Player
                </th>
                {Array.from({ length: INNINGS }, (_, i) => i + 1).map(
                  (inning) => (
                    <th
                      key={inning}
                      className={`px-2 py-4 text-2xl font-bold md:text-3xl lg:text-4xl ${
                        inning === currentInning
                          ? "bg-[#BD3039] text-white"
                          : ""
                      }`}
                    >
                      {inning}
                    </th>
                  ),
                )}
                <th className="px-4 py-4 text-2xl font-bold md:text-3xl lg:text-4xl">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAYERS.map((player, playerIndex) => {
                const status = getPlayerStatus(scores[playerIndex]);

                return (
                  <tr
                    key={player}
                    className="border-b-2 border-[#0C2E1F]/20 even:bg-[#0C2E1F]/5"
                  >
                    <td className="px-4 py-3 text-left text-xl font-semibold md:text-2xl lg:text-3xl">
                      {player}
                    </td>
                    {scores[playerIndex].map((cell, inningIndex) => {
                      const inning = inningIndex + 1;
                      const isCurrentInning = inning === currentInning;

                      return (
                        <td
                          key={inning}
                          className={`px-2 py-2 ${
                            isCurrentInning ? "bg-[#BD3039]/10" : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleCellClick(playerIndex, inningIndex)
                            }
                            className="flex h-14 w-full items-center justify-center rounded-lg text-3xl transition hover:bg-[#0C2E1F]/10 active:scale-95 md:h-16 md:text-4xl lg:h-20 lg:text-5xl"
                            aria-label={`${player} inning ${inning}: ${cell}`}
                          >
                            {CELL_DISPLAY[cell]}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-xl font-bold md:text-2xl lg:text-3xl">
                      <span
                        className={
                          status === "Eliminated"
                            ? "text-[#BD3039]"
                            : status === "Finished"
                              ? "text-[#0C2E1F]"
                              : "text-black"
                        }
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 border-t-4 border-[#0C2E1F] pt-6 md:grid-cols-3 md:gap-8">
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-[#0C2E1F] md:text-3xl lg:text-4xl">
              Champion
            </p>
            <p className="mt-1 text-2xl font-semibold md:text-3xl lg:text-4xl">
              {champion}
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-[#0C2E1F] md:text-3xl lg:text-4xl">
              Last Eliminated
            </p>
            <p className="mt-1 text-2xl font-semibold md:text-3xl lg:text-4xl">
              {lastEliminated}
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-[#0C2E1F] md:text-3xl lg:text-4xl">
              Hot Dog Hero
            </p>
            <p className="mt-1 text-2xl font-semibold md:text-3xl lg:text-4xl">
              {hotDogHero}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
