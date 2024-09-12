import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    const [socketInstance, setSocketInstance] = useState(null);

    useEffect(() => {
        console.log({ userInfo })
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: {
                    userId: userInfo.id
                },
            });

            socket.current.on("connect", () => {
                console.log("Successfully connected to Socket Server");
                setSocketInstance(socket.current);
            });

            socket.current.on("connect_error", (error) => {
                console.error("Connection error:", error);
            });

            socket.current.on("disconnect", () => {
                console.log("Socket disconnected");
                setSocketInstance(null);
            });

            const handleReceiveMessage = (message) => {
                const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();

                if (
                    selectedChatType &&
                    (
                        selectedChatData._id === message.sender._id ||
                        selectedChatData._id === message.recipient._id
                    )
                ) {
                    console.log("Received message:", message);
                    addMessage(message);
                }
            };

            const handleReceiveChannelMessage = (message) => {
                const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();
                if (selectedChatType && selectedChatData._id === message.channelId) {
                    addMessage(message);
                }
            }

            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("receive-channel-message", handleReceiveChannelMessage);

            return () => {
                socket.current.disconnect();
                console.log("Socket connection closed");
            };
        }

    }, [userInfo]);

    return (
        <SocketContext.Provider value={socketInstance}>
            {children}
        </SocketContext.Provider>
    );
}