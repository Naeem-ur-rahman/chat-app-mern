import { Server as SocketIOServer } from 'socket.io'
import Message from './models/messages.js';
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
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

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

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User Connected: ${userId} with SocketId: ${socket.id}`)
        } else {
            console.log("UserId not provided during connection!")
        }

        socket.on("disconnect", ()=> disconnect(socket))

        socket.on("sendMessage", sendMessage)
    })

};

export default setupSocket; 