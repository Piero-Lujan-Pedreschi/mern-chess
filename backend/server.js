import express from 'express';
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";
import {connectDB } from './config/db.js';
import signupRoutes from './routes/signup.route.js';
import loginRoutes from './routes/login.route.js';
import logoutRoutes from './routes/logout.route.js';
import refreshRoutes from './routes/refresh.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/auth/refresh', refreshRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});
