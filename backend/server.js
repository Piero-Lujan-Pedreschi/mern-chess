import express from 'express';
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

import { connectDB } from './config/db.js';
import { Server } from "socket.io";
import registerSocketHandlers from './sockets/sockets.js';


import signupRoutes from './routes/signup.route.js';
import loginRoutes from './routes/login.route.js';
import logoutRoutes from './routes/logout.route.js';
import refreshRoutes from './routes/refresh.route.js';
import gameRoutes from './routes/games.route.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());

app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/auth/refresh', refreshRoutes);
app.use("/api/games", gameRoutes);


connectDB();

const server = app.listen(PORT, () => {
    console.log("Server started at http://localhost:" + PORT);
});

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  registerSocketHandlers(io);

