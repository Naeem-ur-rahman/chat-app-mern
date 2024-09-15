import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import "@/assets/scrollbar.css";
import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { AvatarFallback } from "@/components/ui/avatar";

const MessageContainer = () => {
    const scrollRef = useRef();
    const { selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages,
        setIsDownloading,
        setFileDownloadProgress,
        userInfo,
    } = useAppStore()
    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const responce = await apiClient.post(GET_ALL_MESSAGES_ROUTE,
                    { id: selectedChatData._id },
                    { withCredentials: true }
                );
                if (responce.status === 200 && responce.data.messages) {
                    setSelectedChatMessages(responce.data.messages)
                }
            } catch (error) {
                console.log({ error })
            }
        }
        const getChannelMessages = async () => {
            try {
                const responce = await apiClient.get(
                    `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
                    { withCredentials: true }
                );
                console.log(responce);

                if (responce.status === 200 && responce.data.messages) {
                    setSelectedChatMessages(responce.data.messages)
                }
            } catch (error) {
                console.log({ error })
            }
        }

        if (selectedChatData._id) {
            if (selectedChatType === 'contact') getMessages()
            else if (selectedChatType === 'channel') getChannelMessages()
        }
    }, [selectedChatData, selectedChatType, setSelectedChatMessages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessages])

    const renderMessages = () => {
        let lastDate = null;
        return selectedChatMessages?.map((message, index) => {
            const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
            return (
                <div key={index}>
                    {showDate && (<div className="text-center text-gray-500 my-2">
                        {moment(message.timestamp).format("LL")}
                    </div>
                    )}
                    {
                        selectedChatType === 'contact' && renderDMMessages(message)
                    }
                    {
                        selectedChatType === 'channel' && renderChannelMessages(message)
                    }
                </div>
            )
        })
    };

    const checkIfImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath);
    }

    const downloadFile = async (url) => {
        try {
            setIsDownloading(true)
            setFileDownloadProgress(0)
            const response = await apiClient.get(`${HOST}/${url}`,
                {
                    responseType: "blob",
                    onDownloadProgress: (data) => {
                        const { loaded, total } = data;
                        const percentCompleted = Math.round((loaded * 100) / total)
                        setFileDownloadProgress(percentCompleted)
                    }
                }
            );
            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", url.split("/").pop());
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
            setIsDownloading(false)
            setFileDownloadProgress(0)
        } catch (error) {
            setIsDownloading(false)
            setFileDownloadProgress(0)
            console.log(error)
            toast.error(JSON.stringify(error.message))
        }
    }

    const renderDMMessages = (message) => (
        <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
            {message.messageType === 'text' && (
                <div className={`${message.sender !== selectedChatData._id
                    ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]"
                    : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border inline-block p-2 md:p-4 rounded my-1 max-w-[50%] break-words`}>
                    {message.content}
                </div>
            )}
            {
                message.messageType === "file" && (
                    <div className={`${message.sender !== selectedChatData._id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]"
                        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                        } border inline-block p-2 md:p-4 rounded my-1 max-w-[50%] break-words`}>
                        {
                            checkIfImage(message.fileUrl)
                                ? (<div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setShowImage(true)
                                        setImageURL(message.fileUrl)
                                    }}
                                >
                                    <img src={`${HOST}/${message.fileUrl}`} width={300} height={300} />
                                </div>)
                                : (<div className="flex items-center justify-center gap-4">
                                    <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                                        <MdFolderZip />
                                    </span>
                                    <span>{message.fileUrl.split('/').pop()}</span>
                                    <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                        onClick={() => downloadFile(message.fileUrl)}
                                    >
                                        <IoMdArrowRoundDown />
                                    </span>
                                </div>)
                        }
                    </div>
                )
            }
            <div className="text-xs text-gray-600">
                {
                    moment(message.timestamp).format("LT")
                }
            </div>
        </div>
    )

    const renderChannelMessages = (message) => {
        return (
            <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`} >
                {message.messageType === 'text' && (
                    <div className={`${message.sender._id === userInfo.id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]"
                        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                        } border inline-block p-2 md:p-4 rounded my-1 max-w-[50%] break-words ml-10`}>
                        {message.content}
                    </div>
                )}

                {
                    message.messageType === "file" && (
                        <div className={`${message.sender._id === userInfo.id
                            ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]"
                            : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                            } border inline-block p-2 md:p-4 rounded my-1 max-w-[50%] break-words ml-10`}>
                            {
                                checkIfImage(message.fileUrl)
                                    ? (<div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setShowImage(true)
                                            setImageURL(message.fileUrl)
                                        }}
                                    >
                                        <img src={`${HOST}/${message.fileUrl}`} width={300} height={300} />
                                    </div>)
                                    : (<div className="flex items-center justify-center gap-4">
                                        <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                                            <MdFolderZip />
                                        </span>
                                        <span>{message.fileUrl.split('/').pop()}</span>
                                        <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                            onClick={() => downloadFile(message.fileUrl)}
                                        >
                                            <IoMdArrowRoundDown />
                                        </span>
                                    </div>)
                            }
                        </div>
                    )
                }

                {message.sender._id !== userInfo.id
                    ? <div className="flex items-center justify-start gap-3">

                        <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                            {
                                message.sender.image &&
                                (<AvatarImage
                                    src={`${HOST}/${message.sender.image}`}
                                    alt="Profile"
                                    className="object-cover h-full w-full rounded-full bg-black"
                                />
                                )}
                            <AvatarFallback
                                className={`w-8 h-8 uppercase text-lg border-[1px] rounded-full flex items-center justify-center ${getColor(message.sender.color)}`}>
                                {
                                    message.sender.firstName
                                        ? message.sender.firstName?.split('').shift()
                                        : message.sender.email?.split('').shift()
                                }
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
                        <span className="text-xs text-white/60">
                            {moment(message.timestamp).format("LT")}
                        </span>
                    </div>
                    : <div className="text-xs text-white/60">
                        {moment(message.timestamp).format("LT")}
                    </ div>
                }
            </div>
        )
    }

    return (
        <div className="
        flex-1 overflow-y-auto p-4 px-2 md:px-8 md:w-[65vw] lg:w[70vw] xl:w-[80vw] w-full
        scrollbar
        "
        >
            {renderMessages()}
            <div ref={scrollRef} />
            {showImage && (
                <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
                    <div>
                        <img src={`${HOST}/${imageURL}`}
                            className="h-auto lg:h-[80vh] w-full bg-cover"
                        />
                    </div>
                    <div className="flex gap-5 fixed top-0 mt-2">
                        <button
                            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                            onClick={() => downloadFile(imageURL)}
                        >
                            <IoMdArrowRoundDown />
                        </button>
                        <button
                            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                            onClick={() => {
                                setShowImage(false);
                                setImageURL(null)
                            }}
                        >
                            <IoCloseSharp />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageContainer;