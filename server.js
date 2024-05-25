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

const getPlayerList = (io, roomId) => {
  const idsList = Array.from(io.sockets.adapter.rooms.get(roomId));
  const playerList = idsList.map((id) => {
    const { username } = io.sockets.sockets.get(id);
    return { id, username };
  });
  return playerList;
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("USER IS CONNECTED ----------");
    socket.on("init_user", ({ roomId, username }) => {
      socket.username = username;

      if (rooms.has(roomId)) {
        const users = rooms.get(roomId);
        users.set(socket.id, { username: username });
        rooms.set(roomId, users);
      } else {
        const users = new Map();
        users.set(socket.id, { username: username });
        rooms.set(roomId, users);
      }

      socket.join(roomId);

      const playerList = getPlayerList(io, roomId);
      io.to(roomId).emit("player_list", playerList);
    });
    socket.on("disconnecting", () => {
      const playerRooms = Array.from(socket.rooms);

      playerRooms.forEach((roomId) => {
        if (rooms.has(roomId)) {
          const users = rooms.get(roomId);
          users.delete(socket.id);
          if (users.size == 0) {
            rooms.delete(roomId);
          } else {
            rooms.set(roomId, users);
            const playerList = getPlayerList(io, roomId).filter(
              ({ id }) => id !== socket.id
            );
            io.to(roomId).emit("player_list", playerList);
          }
        }
      });
    });
    socket.on("disconnect", () => {
      console.log("Player disconnected");
    });
    socket.on("room_message", (message) => {
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
