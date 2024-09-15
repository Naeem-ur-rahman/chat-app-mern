import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { RiCloseFill } from 'react-icons/ri'

const ChatHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore();
    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5 md:px-20">
            <div className="flex gap-5 items-center">
                <div className="flex gap-3 items-center justify-center">
                    <div className="w-12 h-12 relative">
                        {
                            selectedChatType === 'contact'
                                ? <Avatar className="w-12 h-12">
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
                                </Avatar>
                                : <div className="bg-[#ffffff22] h-12 w-12 flex items-center justify-center rounded-full">#</div>
                        }
                    </div>
                    <div className="flex flex-col">
                        {
                            selectedChatType === 'contact'
                                ? selectedChatData.firstName && selectedChatData.lastName ?
                                    `${selectedChatData.firstName} ${selectedChatData.lastName}`
                                    :
                                    selectedChatData.email
                                : selectedChatData.name
                        }
                    </div>
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
