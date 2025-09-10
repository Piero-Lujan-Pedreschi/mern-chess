import express from 'express';
import User from "../models/users.model.js";
import mongoose from 'mongoose';

// import { createGame, joinGame, fetchGames, updateGames } from "../controllers/games.controller.js";
import {  joinGame, createGame } from "../controllers/games.controller.js";

const router = express.Router();

router.post("/create", (req, res, next) => {
        console.log("Post /api/games hit");
        console.log("Request body:", req.body);
        next();
    },
    createGame
);

router.post("/join", (req, res, next) => {
    console.log("Post /api/games/join hit");
    console.log("Request body:", req.body);
    next();
  },
  joinGame
);

// router.get("/fetch", (req, res, next) => {
//         console.log("Get /api/games/fetch hit");
//         console.log("request body: ", req.body);
//         next();
//     }, 
//     fetchGames
// );

export default router;