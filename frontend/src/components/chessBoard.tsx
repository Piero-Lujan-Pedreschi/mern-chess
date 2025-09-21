import React, { useRef, useState, useEffect} from "react";
import { useUserStore } from "../store/user";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs, PieceHandlerArgs } from "react-chessboard";
import { Chess, Move } from "chess.js";

type PlayerColorProps = {
  playerColor: 'white' | 'black';
  onLocalMove: (move: Move) => void;
  opponentMove: Move;
  roomId: string;
};

const ChessBoard: React.FC<PlayerColorProps> = ({ playerColor, onLocalMove, opponentMove, roomId }) => {
  // create a chess game using a ref to maintain the game state across renders
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;
  const { movePiece } = useUserStore();
  // console.log(playerColor, "when in chess component");
  // console.log("opponentMove: ", opponentMove);

  // track the current position of the chess game in state
  const [chessPosition, setChessPosition] = useState(chessGame.fen());

  useEffect(() => {
    if (opponentMove) {
      chessGame.move(opponentMove);
      setChessPosition(chessGame.fen());
      checkOpponentMove(opponentMove);
    }
  }, [opponentMove, chessGame]);
  //add if statements to see if possible checkmate or check to warn player

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    const move = chessGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    if (!move) return false;

    console.log("move: ", move);
    setChessPosition(chessGame.fen());

    (async () => {
      try {
        onLocalMove(move);
        const moveData =  await movePiece(move, roomId);

        if (moveData.success) {
          checkMove(moveData);
        }

      } catch (error) {
        console.error("failed to send move: ", error);
      }
    })();

    return true;
  }

  function canDragPieceWhite({ piece }: PieceHandlerArgs) {
    return piece.pieceType[0] === "w";
  }

  // allow black to only drag black pieces
  function canDragPieceBlack({ piece }: PieceHandlerArgs) {
    return piece.pieceType[0] === "b";
  }

  // board options
  // set the chessboard options for white's perspective
  const whiteBoardOptions = {
    canDragPiece: canDragPieceWhite,
    position: chessPosition,
    onPieceDrop,
    boardOrientation: "white" as const,
    id: "multiplayer-white",
  };

  // set the chessboard options for black's perspective
  const blackBoardOptions = {
    canDragPiece: canDragPieceBlack,
    position: chessPosition,
    onPieceDrop,
    boardOrientation: "black" as const,
    id: "multiplayer-black",
  };

  // render boards
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: "10px",
      }}
    >
      <div>
        <div style={{ maxWidth: "400px" }}>
          <p>{playerColor}</p>
          <Chessboard
            options={
              playerColor == "white" ? whiteBoardOptions : blackBoardOptions
            }
          />
        </div>
      </div>

      {/* <div>
        <p style={{ textAlign: "center" }}>Black&apos;s perspective</p>
        <div style={{ maxWidth: "400px" }}>
          <Chessboard options={blackBoardOptions} />
        </div>
      </div>
      <div>
        <p style={{ textAlign: "center" }}>Black&apos;s perspective</p>
        <div style={{ maxWidth: "400px" }}>
          <Chessboard options={whiteBoardOptions} />
        </div>
      </div> */}
    </div>
  );
};

export default ChessBoard;

function checkMove(moveData: { success: boolean; message: string; data: Move | null; }) {
  const yourMove = moveData.data?.san;
  console.log(typeof yourMove); 
  console.log(yourMove);
  if (!yourMove) {
    console.log("yourMove does not exist");
    throw new Error("yourMove has not been instantiated a value");
  } else if (yourMove.includes("+")) {
    console.log("You have checked your opponent");
  } else if (yourMove.includes("#")) {
    console.log("You have checkmated your opponent");
  } else if (yourMove.includes("O-O")) {
    console.log("You castled")
  }
  
}

function checkOpponentMove(opponentMove: Move) {
  const oppMove = opponentMove.san;
  console.log(typeof oppMove);
  console.log(oppMove);
  if (!oppMove) {
    console.log("oppMove does not exist");
    throw new Error("oppMove has not been instantiated a value");
  } else if (oppMove.includes("+")) {
    console.log("You have been checked");
  } else if (oppMove.includes("#")) {
    console.log("You have been checkmated");
  } 
}
