import { socket } from "@/socket";
import WaitingRoom from "@/components/WaitingRoom";
import { PlayerType } from "@/utils/types/players";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import InviteRoom from "@/components/InviteRoom";

export default function Game() {
  const router = useRouter();

  console.log("gameId", router.query.gameId);
  console.log("username", router.query.username);

  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<string[]>([]);
  const [playerList, setPlayerList] = useState<PlayerType[]>([]);
  const [username, setUsername] = useState<string | undefined>(undefined);

  const onRoomMessage = (message: string) => {
    console.log("room message arrived");
    console.log(message);
    setMessages((prev) => [...prev, message]);
  };

  const onPlayerList = (players: PlayerType[]) => {
    console.log("Player list refreshed");
    console.log(players[0].username);
    setPlayerList(players);
  };

  const onConnect = () => {
    console.log("socket.id");
    console.log(socket.id);
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport: any) => {
      setTransport(transport.name);
    });
  };

  const onDisconnect = () => {
    setIsConnected(false);
    setTransport("N/A");
  };

  const handleUserInit = (name: string) => {
    setUsername(name);
    socket.emit("init_user", {
      gameId: router.query.gameId,
      username: name
    });
  };

  useEffect(() => {
    console.log("router preparing --------------------------");
    if (router.isReady && socket.connected && router.query.username) {
      handleUserInit(`${router.query.username}`);
    }
  }, [router, socket.connected]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room_message", onRoomMessage);
    socket.on("player_list", onPlayerList);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room_message", onRoomMessage);
      socket.on("player_list", onPlayerList);
    };
  }, []);

  // const onMessageChange = (event: React.FormEvent<HTMLInputElement>): void => {
  //   const message = event.currentTarget.value;
  //   setCurrentMessage(message);
  //   console.log("message");
  //   console.log(message);
  // };

  // const handleSumbitMessage = (): void => {
  //   socket.emit("room_message", { room: gameId, text: currentMessage });
  //   console.log("currentMessage");
  //   console.log(currentMessage);
  //   setCurrentMessage("");
  // };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-20 p-24">
      <div>My Game: {router.query.gameId}</div>
      <div className="flex gap-20">
        {!username ? (
          <InviteRoom onSubmitUsername={handleUserInit} />
        ) : (
          <WaitingRoom players={playerList} />
        )}

        {/* <div className="flex flex-col gap-1">
          <div className="bg-white grow">
            {messages.map((m, index) => (
              <div key={index}>{m}</div>
            ))}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              onChange={onMessageChange}
              value={currentMessage}
            />
            <button onClick={handleSumbitMessage}>Envoyer</button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
