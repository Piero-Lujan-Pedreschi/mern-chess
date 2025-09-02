import User from '../models/users.model.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
  const user = req.body;
  if (!user.username || !user.email || !user.password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const payload = {
    id: user._id,
    username: user.username,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

  const hashedPassword = await bcrypt.hash(user.password.trim(), 10);
  const hashedRefreshToken = await bcrypt.hash(refreshToken.trim(), 10)

  const newUser = new User({
    ...user,
    password: hashedPassword.trim(),
    refreshToken: hashedRefreshToken.trim()
  });

  try {
    await newUser.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false, //use true in production
      sameSite: "strict",
    });
    res.status(201)
      .json({
        success: true,
        accessToken: accessToken,
        data: newUser,
      })
      
  } catch (error) {
    console.error("Error in Create user: ", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

function generateAccessToken(userID) {
  return jwt.sign(userID, process.env.JWT_TOKEN_SECRET, { expiresIn: "15m" });
}