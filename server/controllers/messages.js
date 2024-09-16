import Message from "../models/messages.js";
import { existsSync, mkdirSync, renameSync, rmSync } from "fs"
export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            res.status(400).send("Both User Id's are Required");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });

        return res.status(200).json({ messages })
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is Required!")
        }

        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${req.file.originalname}`;

        mkdirSync(fileDir, { recursive: true })
        renameSync(req.file.path, fileName)

        return await res.status(200).json({
            filePath: fileName,
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send("Internal Server Error");
    }
}

export const removeFile = async (req, res, next) => {
    try {
        
        const { messageId } = req.body;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).send("Message not found"); // Corrected to check for the message, not the user
        }

        if (message.messageType !== "file") {
            return res.status(404).send("This message is not a file"); // Corrected to check for the messageType
        }

        // Get the folder path from the file URL
        const folderPath = message.fileUrl.substring(0, message.fileUrl.lastIndexOf('/'));

        // Check if the folder exists and remove it along with its contents
        if (existsSync(folderPath)) {
            rmSync(folderPath, { recursive: true }); // Delete the folder and its contents
        }

        // Remove the message from the database
        await Message.findByIdAndDelete(messageId);

        return res.status(200).send("File, folder, and message deleted successfully.");
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
};
