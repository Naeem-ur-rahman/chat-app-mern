import User from "../models/user.js";
import { existsSync, renameSync, unlinkSync } from 'fs'

const maxAge = 3 * 24 * 60 * 60 * 1000;

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).send("Email and Password Required.")

        const user = await User.create({ email, password })

        const token = await User.matchPasswordAndGenerateToken(email, password);

        if (token.error) return res.status(404).send(token.error)

        const payload = process.env.ORIGIN === "http://localhost:5173"
            ? { maxAge, secure: true, sameSite: "None" }
            : {
                maxAge, httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set to true in production
                sameSite: 'None',
            }

        res.cookie("jwt", token, payload);

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

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not Found.")
        }

        const token = await User.matchPasswordAndGenerateToken(email, password);

        if (token.error) return res.status(404).send({ error: token.error })

        const payload = process.env.ORIGIN === "http://localhost:5173"
            ? { maxAge, secure: true, sameSite: "None" }
            : {
                maxAge, httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set to true in production
                sameSite: 'None',
            }

        res.cookie("jwt", token, payload);

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
        const { userId } = req;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Check if the image exists in the file system or not
        if (user.image && existsSync(user.image)) {
            unlinkSync(user.image); // Remove the file if it exists
        }

        // If the image does not exist, remove the reference from the database anyway
        if (user.image) {
            user.image = null;
            await user.save();
            return res.status(200).send("Profile Image Deleted Successfully.");
        }

        return res.status(400).send("No profile image found.");
    } catch (error) {
        console.log({ error });
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