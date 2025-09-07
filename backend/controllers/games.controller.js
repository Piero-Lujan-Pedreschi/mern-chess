import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const joinGame = async (req, res) => {
   res
     .status(200)
     .json({ success: true, message: "Successfully called joinGame in backend" });
};

export const createGame = async (req, res) => {
    res.status(200).json({ success: true, message: "Successfully called createGame in backend" });
}
