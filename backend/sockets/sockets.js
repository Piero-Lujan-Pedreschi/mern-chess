import Match from "../models/matches.model.js";

export const games = new Map();

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("customEvent", (string) => {
      console.log(string);
    });

    socket.on("joinGame", (id) => {
      console.log(games.get(id));
      const game = games.get(id);
      if (!game) {
        console.log("game not found with id: ", id);
        socket.emit("error", "Room has not been found");
        return;
      }

      if (game.players.length >= 2) {
        console.log(game.players.length, " players already in the game");
        socket.emit("error", "Room has already two players");
        return;
      }

      game.players.push(socket.id);
      console.log("game joined with id: ", id);
      console.log(game.players.length, " players in the game");
      socket.join(id);
    });

    socket.on("createGame", (id) => {
      // games.set(roomId: id, { hostId: socket.id, players: [socket.id] });
      console.log("game created with id: ", id);
      socket.join(id);
    });

    // socket.on;

    socket.on("disconnect", (reason) => {
      console.log("client has disconnected: ", socket.id, reason);
    });
  });
}