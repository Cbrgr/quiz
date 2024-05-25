import { socket } from "@/socket";
import { PlayerType } from "@/utils/types/players";
import { useState } from "react";

type Props = {
  players: PlayerType[];
};

const WaitingRoom = ({ players }: Props) => {
  const gameModes = [
    { id: 1, label: "Partie classique" },
    { id: 2, label: "Partie rapide" },
    { id: 3, label: "Partie QCM" },
    { id: 4, label: "Partie lol" },
    { id: 5, label: "Partie bla" }
  ];

  const [selectedGameMode, setSelectedGameMode] = useState<number>(
    gameModes[0].id
  );

  const handleGameModeClick = (gameModeId: number) => {
    setSelectedGameMode(gameModeId);
  };

  return (
    <div className="flex flex-col items-center gap-20">
      <div className="bg-orange-500 p-10">Logo</div>
      <div className="flex gap-20">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {players.map((player) => (
              <div
                className={`text-center p-1 bg-blue-300 border-2 ${
                  socket.id === player.id
                    ? "border-black"
                    : "border-transparent"
                }`}
                key={player.id}
              >
                {player.username}
              </div>
            ))}
          </div>

          <button className="w-full p-2 bg-orange-500">Mode spectateur</button>
        </div>
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-5">
            {gameModes.map((m) => {
              const isSelected = selectedGameMode === m.id;
              return (
                <div
                  key={m.id}
                  className={`h-[100px] p-2 bg-cyan-500 flex items-center justify-center border-4 cursor-pointer ${
                    isSelected ? "border-red-500 bg-white" : ""
                  }`}
                  onClick={() => handleGameModeClick(m.id)}
                >
                  {m.label}
                </div>
              );
            })}
          </div>
          <div className="flex gap-5 justify-center items-center">
            <button className="bg-blue-500 p-2">Inviter</button>
            <button className="bg-blue-500 p-2">Démarrer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
