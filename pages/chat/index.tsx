"use client";

import { socket } from "@/socket";
import { useEffect, useState } from "react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const onPrivateMessage = (message: string) => {
    console.log("private message");
    console.log(message);
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("socket.id");
      console.log(socket.id);
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("toto", onPrivateMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("toto", onPrivateMessage);
    };
  }, []);

  const emitMessage = () => {
    socket.emit("private_message", "COUCOU");
    console.log("click button");
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <button onClick={emitMessage}>Emettre un message</button>
    </div>
  );
}
