import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const logoutUser = async (req, res) => {
    console.log("Logout user hit");
    try {
        const refreshToken = req.cookies.jwt
        if (!refreshToken) {
            res.status(401).json({ success: false, message: "No token provided" });
        }

        await User.updateOne(
            { refreshToken: refreshToken },
            { $set: {refreshToken: null} }
        );

        res.clearCookie("jwt", { httpOnly: true, secure: false });
        res.status(200).json({ success: true, message: "Successfully logged out user"});
    } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: error.message});
    }
}
