import User from '../models/users.model.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


export const loginUser = async (req, res) => {
    console.log("running3");
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("incomplete field");
        return res
          .status(400)
          .json({ success: false, message: "Please provide all fields" });
    }

    const user = await User.findOne({ email });
    if (user) {
        console.log("user found");
        try {
            const passwordsMatch = await bcrypt.compare(password.trim(), user.password);

            if (passwordsMatch) {
                console.log("user match");
                const payload = { 
                    id: user._id,
                    username: user.username,
                };
                const accessToken = generateAccessToken(payload);
                const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

                const hashedRefreshToken = await bcrypt.hash(refreshToken.trim(), 10);
                user.refreshToken = hashedRefreshToken;
                await user.save();

                res.cookie("jwt", refreshToken, {
                  httpOnly: true,
                  secure: false, //use true in production
                  sameSite: "strict",
                });
                res.status(201)
                    .json({success: true, data: user, accessToken: accessToken, message: "Successfully logged in"})
                    
            } else {
                console.log("user doesn't match");
                return res.status(400).json({ success: false, message: "Password is incorrect",});
            }
        } catch(error) {
            console.error("Error in Login user: ", error.message);
            return res.status(500).json({ success: false, message: "Password error" });
        }
    } else {
        console.log("user not found");
        return res
            .status(404)
            .json({ success: false, message: "User does not exist"})
    }
    
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_TOKEN_SECRET, { expiresIn: "15m" });
}