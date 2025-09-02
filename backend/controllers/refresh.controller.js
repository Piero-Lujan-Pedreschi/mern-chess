import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "No token provided" });
    };

    try {
        const foundUser = await User.findOne({ refreshToken: refreshToken });
        if (foundUser) {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const accessToken = generateAccessToken(payload);
            res.status(200).json({ success: true, accessToken: accessToken });
        } else {
            return res.status(403).json ({ success: false, message: "No such token" });
        }
    } catch (error) {
        return res.status(403).json ({ success: false, message: "Invalid or Expired Token" });
    }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_TOKEN_SECRET, { expiresIn: "15m" });
}