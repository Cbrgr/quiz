import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("USER IS CONNECTED");
    socket.on("init_user", ({ gameId, username }) => {
      // socket.username = username;
      console.log("gameId");
      console.log(gameId);
      socket.join(gameId);

      console.log("io.sockets.adapter.rooms.get(gameId)");
      console.log(io.sockets.adapter.rooms.get(gameId));

      const playerList = Array.from(io.sockets.adapter.rooms.get(gameId));
      io.to(gameId).emit("player_list", playerList);
    });
    socket.on("disconnecting", () => {
      console.log("Player disconnecting");
      console.log(socket.rooms); // the Set contains at least the socket ID
      // const rooms = Array.from(socket.rooms).slice(1);
      // console.log("rooms list");
      // console.log(rooms);
      // rooms.forEach((roomId) => {
      //   console.log("roomId");
      //   console.log(roomId);
      //   const playerList = Array.from(io.sockets.adapter.rooms.get(roomId));
      //   console.log("playerList");
      //   console.log(playerList);
      //   io.to(roomId).emit("player_list", playerList);
      // });
    });
    socket.on("disconnect", () => {
      console.log("Player disconnected");
      console.log(socket.id);
      console.log(socket.username);
    });
    socket.on("room_message", (message) => {
      console.log("ROOM MESSAGE");
      console.log(message);
      console.log(message.room);
      // io.emit("room_message", message.text);
      io.to(message.room).emit("room_message", message.text);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
