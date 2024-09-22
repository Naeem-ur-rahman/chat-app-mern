import mongoose from "mongoose";
import Channel from "../models/channels.js";
import User from "../models/user.js"

export const createChannel = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;

        const admin = await User.findById(userId);

        if (!admin) return res.status(400).send("Admin user not found");

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            res.status(400).send("Some members are not valid users.");
        }

        const newChannel = new Channel({
            name, members, admin: userId
        })

        await newChannel.save();

        const populatedChannel = await Channel.findById(newChannel._id)
            .populate("admin", "_id firstName lastName email color image")
            .populate("members", "_id firstName lastName email color image");

        return res.status(201).json({ channel: populatedChannel });

    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserChannels = async (req, res, next) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.userId);

        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        })
            .populate("admin", "_id firstName lastName email color image")
            .populate("members", "_id firstName lastName email color image")
            .sort({ updatedAt: -1 });

        return res.status(200).json({ channels });

    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const getChannelMessages = async (req, res, next) => {
    try {

        const { channelId } = req.params;

        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "firstName lastName email _id color image",
            },
        })

        if (!channel) { return res.status(404).send("Channel not found."); }

        const messages = channel.messages;

        return res.status(200).json({ messages });

    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}