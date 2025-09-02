import express from 'express';
import User from "../models/users.model.js";
import mongoose from 'mongoose';

import { createUser } from "../controllers/signup.controller.js";

const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).json({ success: true, data: users });
//   } catch (error) {
//     console.log("error in fetching users: ", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.post("/", (req, res, next) => {
    console.log("POST /api/signup hit");
    next();
  },
  createUser
);

// router.put("/:id", async (req, res) => {
//   const { id } = req.params;

//   const user = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ success: false, message: "Invalid User Id" });
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
//     res.status(200).json({ success: true, data: updatedUser });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     await User.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "User deleted" });
//   } catch (error) {
//     console.log("Error in deleting user: ", error.message);
//     res.status(404).json({ success: false, message: "User not found" });
//   }
// });

export default router;