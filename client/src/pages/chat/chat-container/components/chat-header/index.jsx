import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import UserInfo from '@/components/UserInfo';
import "@/assets/scrollbar.css";

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType, directMessagesContactsLiveStatus } = useAppStore();
    const [channelInfoshow, setChannelInfoshow] = useState(false);
    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5 md:px-20">
            <div className="flex gap-5 items-center">
                <div className=" relative flex gap-3 items-center justify-center">
                    <div className="w-12 h-12 relative">
                        {
                            selectedChatType === 'contact'
                                ? <Avatar className="w-12 h-12 rounded relative">
                                    {
                                        selectedChatData.image ?
                                            <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="Profile" className="object-cover h-full w-full rounded-full bg-black" />
                                            :
                                            <div
                                                className={`w-12 h-12 text-lg border-[1px] rounded-full flex items-center justify-center ${getColor(selectedChatData.color)}`}>
                                                {
                                                    selectedChatData.firstName ?
                                                        selectedChatData.firstName?.split('').shift()
                                                        :
                                                        selectedChatData.email?.split('').shift().toUpperCase()
                                                }
                                            </div>
                                    }
                                    <div className={`h-[12px] w-[12px] ${directMessagesContactsLiveStatus?.includes(selectedChatData._id) ? "bg-green-600" : "bg-red-600 "} rounded-3xl absolute right-0 bottom-0`}></div>
                                </Avatar>
                                :
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="bg-[#ffffff22] h-12 w-12 flex items-center justify-center rounded-full"
                                                onClick={() => {
                                                    if (selectedChatType === 'channel') {
                                                        setChannelInfoshow(true)
                                                    }
                                                }}
                                            >
                                                #
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-white bg-[#1c1b1e] border-none">Create New Channel </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                        }
                    </div>

                    <div className="flex flex-col">
                        {
                            selectedChatType === 'contact'
                                ? selectedChatData.firstName && selectedChatData.lastName ?
                                    `${selectedChatData.firstName} ${selectedChatData.lastName}`
                                    :
                                    selectedChatData.email
                                : <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div
                                                onClick={() => {
                                                    if (selectedChatType === 'channel') {
                                                        setChannelInfoshow(true)
                                                    }
                                                }}
                                            >
                                                {selectedChatData.name}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-white bg-[#1c1b1e] border-none">Create New Channel </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                        }
                    </div>

                    {/* channel Dialoge only triggers on the channel avatar or name click */}
                    {
                        selectedChatType === 'channel' && (
                            <Dialog open={channelInfoshow} onOpenChange={setChannelInfoshow}>
                                <DialogContent className="bg-[#1c1d25] border-none text-white w-[350px] h-[350px] overflow-hidden md:w-[400px] md:h-[400px] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle className="text-center">{selectedChatData.name}</DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>
                                    <div>Channel Admin</div>
                                    <UserInfo user={selectedChatData.admin} />
                                    <div>Members ({selectedChatData.members.length}) </div>
                                    <div className='scrollbar flex flex-col overflow-y-auto gap-3'>
                                        {selectedChatData.members.map((member) => <UserInfo user={member} key={member._id} />)}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )
                    }
                </div>
            </div>
            <div className="flex gap-5 items-center justify-center">
                <button
                    className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all '
                    onClick={closeChat}
                >
                    <RiCloseFill className='text-3xl' />
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;
