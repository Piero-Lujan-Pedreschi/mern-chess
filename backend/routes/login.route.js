import express from 'express';
import User from "../models/users.model.js";
import mongoose from 'mongoose';

import { loginUser } from "../controllers/login.controller.js";

const router = express.Router();

router.post("/", (req, res, next) => {
    console.log("Post /api/login hit");
    console.log("Request body:", req.body);
    next();
    },
    loginUser
);

export default router;