import express from 'express';
import { refreshToken } from '../controllers/refresh.controller.js';

const router = express.Router();

router.post("/", (req, res, next) => {
    console.log("Post /api/auth/refresh hit");
    next();
    },
    refreshToken
);

export default router;