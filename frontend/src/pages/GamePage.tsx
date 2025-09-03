import React, {useEffect, useRef} from 'react';
import ChessBoard from '../components/chessBoard';
import { io, Socket } from 'socket.io-client';

const GamePage: React.FC = () => {
    const socketRef = useRef<Socket | null>(null);
    
    useEffect(() => {
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('connect', () => {
            console.log('Connected to server with ID: ' + socketRef.current?.id);
        });

        socketRef.current.emit('customEvent', 'Hello from client!');
        
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);



    return (
        <div>
            <h1>game page</h1>
            <ChessBoard />
        </div>
    );
}

export default GamePage;
