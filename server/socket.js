import { Server as SocketIOServer } from 'socket.io'
import Message from './models/messages.js';
import Channel from './models/channels.js';
import { getDMContacts } from './controllers/contacts.js';
const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        let disconnectUser;
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                disconnectUser = userId
                userSocketMap.delete(userId);
                break;
            }
        }
        // send the user disconnected status to its all dm contacts. 
        handleReceiveDisconnectedOrConnectContact(disconnectUser, "receive-disconnected-contact")
    }

    const handleReceiveDisconnectedOrConnectContact = async (user, emitRequest) => {
        const contacts = await getDMContacts(user)
        contacts.map((contact) => {
            if (userSocketMap.has(contact._id.toString())) {
                const socketId = userSocketMap.get(contact._id.toString());
                io.to(socketId).emit(emitRequest, user)
            }
        })
    }

    const sendLiveStatus = async (message) => {
        const senderSocketID = userSocketMap.get(message.user);
        const messageData = []
        message.contacts.forEach((contact) => {
            if (userSocketMap.has(contact)) messageData.push(contact)
        })

        if (senderSocketID) {
            // send the user its live contacts after getting the resquest from the frontend with its contact list then find the live users from the userSocketMap. 
            io.to(senderSocketID).emit("receive-contacts-live-status", messageData)
        }
    };

    const sendMessage = async (message) => {
        const senderSocketID = userSocketMap.get(message.sender);
        const recipientSocketID = userSocketMap.get(message.recipient);

        const createdMessage = await Message.create(message);

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName color image")
            .populate("recipient", "id email firstName lastName color image");

        if (recipientSocketID) {
            io.to(recipientSocketID).emit("receiveMessage", messageData)
        }
        if (senderSocketID) {
            io.to(senderSocketID).emit("receiveMessage", messageData)
        }
    };

    const sendChannelMessage = async (message) => {
        const { sender, content, messageType, fileUrl, channelId } = message;
        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            fileUrl,
            timestamp: new Date(),
        });

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });

        const channel = await Channel.findById(channelId).populate("members");

        const finalData = { ...messageData._doc, channelId: channelId };
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receive-channel-message", finalData)
                }
            });
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("receive-channel-message", finalData)
            }
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User Connected: ${userId} with SocketId: ${socket.id}`)
            // send the connected user as a live status to its contacts. 
            handleReceiveDisconnectedOrConnectContact(userId, "receive-connected-contact")
        } else {
            console.log("UserId not provided during connection!")
        }

        socket.on("disconnect", () => disconnect(socket))

        socket.on("sendMessage", sendMessage)
        socket.on("send-channel-message", sendChannelMessage)
        socket.on("send-contacts-for-live-status", sendLiveStatus)
    })

};

export default setupSocket; 