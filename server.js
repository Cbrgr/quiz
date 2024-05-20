import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const rooms = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("USER IS CONNECTED ----------");
    socket.on("init_user", ({ gameId, username }) => {
      console.log("INIT USER ----------");
      socket.username = username;
      console.log("gameId");
      console.log(gameId);

      if (rooms.has(gameId)) {
        const users = rooms.get(gameId);
        users.set(socket.id, { username: username });
        rooms.set(gameId, users);
        console.log("HAS ROOM");
        console.log("users", users);
      } else {
        const users = new Map();
        users.set(socket.id, { username: username });
        rooms.set(gameId, users);
        console.log("DOES NOT HAVE ROOM");
        console.log("users", users);
      }
      console.log("ROOM MAP");
      console.log(rooms);

      socket.join(gameId);

      console.log("io.sockets.adapter.rooms.get(gameId)");
      console.log(io.sockets.adapter.rooms.get(gameId));

      const idsList = Array.from(io.sockets.adapter.rooms.get(gameId));
      const playersArray = idsList.map((id) => {
        const socketData = io.sockets.sockets.get(id);
        return { id, username: socketData.username };
      });
      console.log("playersList", playersArray);
      io.to(gameId).emit("player_list", playersArray);
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
      console.log(socket.id);
      console.log(socket.username);
      const playerRooms = Array.from(socket.rooms);
      playerRooms.forEach((roomId) => {
        console.log("roomId", roomId);
        if (rooms.has(roomId)) {
          console.log("rooms", rooms);
          const users = rooms.get(roomId);
          users.delete(socket.id);
          if (users.size == 0) {
            rooms.delete(roomId);
          } else {
            rooms.set(roomId, users);
          }
          console.log("DELETE USER");
          console.log("users", users);
          console.log("rooms", rooms);
        }
      });
    });
    socket.on("disconnect", () => {
      console.log("Player disconnected");
      console.log(socket.rooms);
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
