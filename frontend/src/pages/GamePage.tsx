import React, {useState, useEffect, useRef} from 'react';
import ChessBoard from '../components/chessBoard';
import { io, Socket } from 'socket.io-client';
import { useParams, useLocation } from 'react-router-dom';

const GamePage: React.FC = () => {
    const socketRef = useRef<Socket | null>(null);
    const { roomId } = useParams<{ roomId: string }>();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const type = query.get('type');
    const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
    
    useEffect(() => {
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

        return () => {
            socketRef.current?.emit("leaveRoom", roomId);
            socketRef.current?.disconnect();
        };
    }, [type, roomId]);



    return (
        <div>
            <h1>game page</h1>
            <ChessBoard playerColor={playerColor} />
        </div>
    );
}

export default GamePage;
