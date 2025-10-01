import React, {useState, useEffect, useRef} from 'react';
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBar";
import ChessBoard from '../components/chessBoard';
import { io, Socket } from 'socket.io-client';
import { useParams, useLocation } from 'react-router-dom';
import { Move } from 'chess.js';

const GamePage: React.FC = () => {
    const socketRef = useRef<Socket | null>(null);
    const { roomId } = useParams<{ roomId: string }>();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const type = query.get('type');
    const { currentUser } = useUserStore();
    const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
    const [lastMoveFromSocket, setLastMoveFromSocket] = useState<Move | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        // console.log(currentUser);
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('connect', () => {
            console.log('Connected to server with ID: ' + socketRef.current?.id);
        });

        if (type === 'create') {
            socketRef.current.emit("createGame", roomId);
            setPlayerColor('white');
            console.log("joining as white");
        }

        if (type === 'join') {
            socketRef.current.emit("joinGame", roomId);
            setPlayerColor('black');
            console.log("joining as black");
            
        }

        socketRef.current.emit('customEvent', 'Hello from client!'); //will emit both current players to update match players in db

        socketRef.current.on('lastMove', (move) => {
            console.log("opponent move: ", move);
            setLastMoveFromSocket(move);
        })

        socketRef.current.on('cancelGame', () => {
            console.log("cancel game called");
            console.log("host has abandoned the game");
            navigate(`/`);
        })

        return () => {
            socketRef.current?.emit("leaveGame", roomId, currentUser);
            socketRef.current?.disconnect();
        };
    }, [type, roomId, currentUser, navigate]);



    return (
      <div>
        <NavBar />
        <h1>game page</h1>
        <ChessBoard
          playerColor={playerColor}
          onLocalMove={(move) => socketRef.current?.emit("move", move, roomId)}
          opponentMove={lastMoveFromSocket as Move}
          roomId={roomId!}
        />
      </div>
    );
}

export default GamePage;
