import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_CONTACTS_DM_ROUTE, GET_USER_CHANNELS_ROUTE, HOST } from "@/utils/constants";
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
                const { selectedChatType, selectedChatData, addMessage,
                    addContactInDMContacts,
                    directMessagesContacts,
                    setDirectMessagesContacts,
                } = useAppStore.getState();

                if (
                    selectedChatType &&
                    (
                        selectedChatData._id === message.sender._id ||
                        selectedChatData._id === message.recipient._id
                    )
                ) {
                    console.log("Received message:", message);
                    addMessage(message);
                    addContactInDMContacts(message)

                } else if (!directMessagesContacts.some((contact) => contact._id === message.recipient._id)) {

                    const getDMContacts = async () => {
                        try {
                            const response = await apiClient.get(GET_CONTACTS_DM_ROUTE, { withCredentials: true });
                            if (response.status === 200 && response.data.contacts) {
                                setDirectMessagesContacts(response.data.contacts);
                            }
                        } catch (error) {
                            console.error("Error fetching contacts : ", error);
                        }
                    }
                    getDMContacts();
                    
                }
            };

            const handleReceiveChannelMessage = (message) => {
                const { selectedChatType, selectedChatData, addMessage, addChannelInChannelList,
                    channels,
                    setChannels,
                } = useAppStore.getState();

                if (selectedChatType && selectedChatData._id === message.channelId) {
                    addMessage(message);
                    addChannelInChannelList(message);
                } else if (!channels.some((channel) => channel._id === message.channelId)) {
                    
                    const getChannels = async () => {
                        try {
                            const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, { withCredentials: true });
                            if (response.status === 200 && response.data.channels) {
                                setChannels(response.data.channels);
                            }
                        } catch (error) {
                            console.error("Error fetching channels:", error);
                        }
                    };

                    getChannels();

                }
            }

            const handleReceiveContactsLiveStatus = (message) => {
                const { setDirectMessagesContactsLiveStatus } = useAppStore.getState();
                setDirectMessagesContactsLiveStatus(message)
            }

            const handleDisconnectContact = (message) => {
                const { removeContactFromLiveContactList } = useAppStore.getState();
                removeContactFromLiveContactList(message)
            }

            const handleConnectContact = (message) => {
                const { addContactInLiveContactList } = useAppStore.getState();
                addContactInLiveContactList(message)
            }

            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("receive-channel-message", handleReceiveChannelMessage);
            socket.current.on("receive-contacts-live-status", handleReceiveContactsLiveStatus)
            socket.current.on("receive-disconnected-contact", handleDisconnectContact);
            socket.current.on("receive-connected-contact", handleConnectContact);
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