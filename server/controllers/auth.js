import jwt from "jsonwebtoken";
import User from "../models/user.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).send("Email and Password Required.")
        const user = User.create({ email, password })
        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.send(201).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}