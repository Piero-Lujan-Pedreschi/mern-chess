import express from 'express';
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";
import {connectDB } from './config/db.js';
import { Server } from "socket.io";


import signupRoutes from './routes/signup.route.js';
import loginRoutes from './routes/login.route.js';
import logoutRoutes from './routes/logout.route.js';
import refreshRoutes from './routes/refresh.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const io = new Server(3000, {
    cors: {
        origin: ['http://localhost:5173']
    }
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/auth/refresh', refreshRoutes);

const games = new Map();

io.on('connection', socket => {
    console.log(socket.id);
    socket.on('customEvent', (string) => {
        console.log(string);
    });

    socket.on('joinGame', (id) => {
        const game = games.get(id);
        if (!game) {
            socket.emit("error", "Room has not been found");
            return
        }

         if (game.players.length >= 2) {
            socket.emit("error", "Room has already two players");
        }

        game.players.push(socket.id);
        console.log("game joined with id: ", id);
        console.log(game.players.size, " players in the game");
        socket.join(id)
    });

    socket.on('createGame', (id) => {
        games.set(id, { hostId: socket.id, players: [socket.id]});
        console.log("game created with id: ", id);
        socket.join(id);
    })

    socket.on('disconnect', (reason) => {
        console.log('client has disconnected: ', socket.id, reason);
    })
});

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});
