import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";

const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    const { selectedChatType, selectedChatData, userInfo } = useAppStore()
    const socket = useSocket();

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [emojiRef]);

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    }

    const handleSendMessage = async () => {
        if (!message.length) {
            // toast.error("Enter Message")
            return
        }

        if (socket && selectedChatType === 'contact') {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                recipient: selectedChatData._id,
                content: message,
                messageType: 'text',
                fileUrl: undefined,
            });
            setMessage('')
        } else {
            console.error('Socket is not connected or selectedChatType is not "contact".');
        }
    }

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file)
                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, { withCredentials: true })
                if (response.status === 200 && response.data) {
                    if (selectedChatType === 'contact') {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            recipient: selectedChatData._id,
                            content: undefined,
                            messageType: 'file',
                            fileUrl: response.data.filePath,
                        });
                    }
                } else {
                    toast.error("Error while uploading File")
                }
            }
        } catch (error) {
            console.log("Error : ", { error })
        }
    }

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
            <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input
                    type="text"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '
                    onClick={handleAttachmentClick}
                >
                    <GrAttachment className="text-2xl" />
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleAttachmentChange} />
                </button>
                <div className="realative">
                    <button
                        className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '
                        onClick={() => setEmojiPickerOpen(true)}
                    >
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker
                            theme="dark"
                            open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}
                        />
                    </div>
                </div>
            </div>
            <button
                className='bg-[#8417ff] focus:border-none p-4 hover:bg-[#741bda] focus:bg-[#741bda]  focus:outline-none focus:text-white duration-300 transition-all'
                onClick={handleSendMessage}
            >
                <IoSend className="text-2xl" />
            </button>
        </div>
    );
}

export default MessageBar;
