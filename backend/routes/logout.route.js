import express from 'express';

import { logoutUser } from '../controllers/logout.controller.js';

const router = express.Router();

router.post("/", (req, res, next) => {
    console.log("Post /api/logout hit");
    next();
    },
    logoutUser
);

export default router;