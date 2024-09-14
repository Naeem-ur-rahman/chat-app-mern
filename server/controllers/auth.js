import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from 'fs'

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).send("Email and Password Required.")
        const user = await User.create({ email, password })
        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'None',
        });
        return await res.status(201).json({
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

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).send("Email and Password Required.")

        const user = await User.findOne({ email })
        if (!user)
            return res.status(404).send("User not Found with given credentials")

        const auth = compare(password, user.password)
        if (!auth)
            return res.status(400).send("Password Incorrect.")

        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'None',
        });

        return await res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        const _id = req.userId;
        const user = await User.findById({ _id });
        if (!user) {
            return res.status(404).send("User not Found with given id")
        }
        return await res.status(200).json({
            id: user._id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            color: user.color,
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).send("FirstName LastName and color is required")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, {
            firstName,
            lastName,
            color,
            profileSetup: true
        }, { new: true, runValidators: true });

        return await res.status(200).json({
            id: user._id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            color: user.color,
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is Required!")
        }

        const date = Date.now();
        let filename = 'uploads/profiles/' + date + req.file.originalname;
        renameSync(req.file.path, filename)
        const user = await User.findByIdAndUpdate(
            { _id: req.userId },
            { image: filename },
            { new: true, runValidators: true }
        )

        return await res.status(200).json({
            image: user.image,
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const reomveProfileImage = async (req, res, next) => {
    try {
        const { userId } = req
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found")
        }
        if (user.image) {
            unlinkSync(user.image)
        }
        user.image = null;
        await user.save();
        return res.status(200).send("Profile Image Deleted SuccessFully.")
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" })
        return res.status(200).send("Logout SuccessFull.")
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}