import Match from "../models/matches.model.js";
// import registerSocketHandlers from "../sockets/sockets.js";
import { games } from "../sockets/sockets.js";

// registerSocketHandlers(io);

export const joinGame = async (req, res) => {
   const match = req.body;
   console.log("Join game running");

   console.log(match.roomId, match.joiningPlayer);

   if (!match.roomId || !match.joiningPlayer) {
         return res.status(400).json({ success: false, message: "Missing required fields" });
   }

   if (!isExistingGame(match.roomId)) {
        return res.status(400).json({ success: false, message: "No game with this ID exists" });
   }

   const currentGame = isExistingGame(match.roomId);
   const currentGameId = currentGame.matchId;
//    console.log("current game: ", currentGame);
//    console.log("current game id: ", currentGameId);

   try {
    const updatedMatch = await Match.findByIdAndUpdate(currentGameId,
        { $setField: { player2: { user: match.joiningPlayer, moves: [] } } },
        { new: true }
    );

    currentGame.gameInstance = updatedMatch;

    res.status(200).json({ success: true,
            message: "game successfully create with id: " + updatedMatch._id + "  - and host player: " + updatedMatch.player1.user + " - and player2 : " + updatedMatch.player2.user,
            data: updatedMatch});
    
   } catch (error) {
        console.error("Error in join game: ", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
   }
};

export const createGame = async (req, res) => {
    const match = req.body;
    console.log("Create game running");
    
    if (!match.roomId || !match.hostPlayer) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (isExistingGame(match.roomId)) {
        return res.status(400).json({ success: false,  message: "Game with this ID already exists" });   
    }

    try {
        const newMatch = new Match({
            ...match,
            player1: {
                user: match.hostPlayer,
                moves: [],
            }
        });

        await newMatch.save();

        games.set(newMatch.roomId, {
            matchId: newMatch._id,
            hostPlayer: newMatch.player1.user,
            gameInstance: newMatch,
        });
        // console.log(games);
        res.status(200).json({
            success: true,
            message: "game successfully create with id: " + newMatch._id + "  - and host player: " + newMatch.player1.user,
            data: newMatch});

    } catch (error) {
        console.error("Error in Create game: ", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

function isExistingGame(newRoomId) {
    return games.get(newRoomId) || null;zz
}
