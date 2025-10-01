import Match from "../models/matches.model.js";
import { games } from '../controllers/games.controller.js';

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("socket is: ", socket.id);
    socket.on("customEvent", (string) => {
      console.log(string);
    });

    socket.on("joinGame", (roomId) => {
      console.log("game joined with room id: ", roomId);
      console.log("socket.id: ", socket.id);
      socket.join(roomId);
    });

    socket.on("createGame", (roomId) => {
      console.log("game created with room id: ", roomId);
      // console.log(games);
      // console.log(isExistingGame(roomId));

      socket.join(roomId);
    });

    socket.on('move', (move, roomId) => {
      console.log("Server side move : ", move);
      // find a way to send to db
      socket.to(roomId).emit('lastMove', move);
    });

    socket.on('leaveGame', async (roomId, currentUser) => {
      console.log(currentUser + "is leaving the room called");
      console.log(currentUser);
      const currentGame = isExistingGame(roomId);
      console.log(games);
      console.log(currentGame)

      if (!currentGame) {
        console.log("Game was already deleted");
        io.to(roomId).emit(
          "cancelGame",
          "Room closed because host Player left"
        );
        return;
      }

      console.log("current user matches host: ", 
        currentUser, currentUser._id === currentGame.hostPlayer.toHexString()
      );

      if (
        currentUser &&
        currentUser._id === currentGame.hostPlayer.toHexString()
      ) {
        console.log("player leaving is host");
        const currentGameId = currentGame?.matchId;

        const updatedMatch = await Match.findByIdAndUpdate(
          currentGameId,
          { result: "abandoned" },
          { new: true }
        );

        //terminate the game from map and remaining players from room
        games.delete(roomId);

        const room = io.sockets.adapter.rooms.get(roomId);
        
        if (room) {
          for (const socketId of room) {
            const s = io.sockets.sockets.get(socketId);
            console.log("calling cancel game for ", s);
            io.to(roomId).emit(
              "cancelGame",
              "Room closed because host Player left"
            );
          }
        }
      }


      console.log(games);
    })

    socket.on("disconnect", (reason) => {
      console.log("client has disconnected: ", socket.id, reason);
      console.log()
    });
  });
}

function isExistingGame(newRoomId) {
  return games.get(newRoomId) || null;
}