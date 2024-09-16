import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const ContactList = ({ contacts, isChannel = false }) => {

    const { selectedChatData, setSelectedChatType, setSelectedChatData, setSelectedChatMessages,
        directMessagesContactsLiveStatus,
    } = useAppStore()

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType('channel')
        else setSelectedChatType('contact');

        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([])
        }
    }

    return (
        <div className="mt-5">
            {
                contacts.map((contact) => (
                    <div key={contact._id}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer
                            ${selectedChatData && selectedChatData._id === contact._id
                                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                                : "hover:bg-[#f0aaaa11]"
                            }
                            `}
                        onClick={() => handleClick(contact)}
                    >
                        <div className="flex gap-5 items-center justify-start text-neutral-300">
                            {
                                !isChannel && (
                                    <Avatar className="w-10 h-10 rounded-full relative">
                                        {
                                            contact.image ?
                                                <AvatarImage src={`${HOST}/${contact.image}`} alt="Profile" className="object-cover h-full w-full rounded-full bg-black" />
                                                :
                                                <div
                                                    className={`
                                                    ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border-2 border-white/70" : getColor(contact.color)}
                                                    w-10 h-10 text-lg border-[1px] rounded-full flex items-center justify-center`}>
                                                    {
                                                        contact.firstName ?
                                                            contact.firstName?.split('').shift()
                                                            :
                                                            contact.email?.split('').shift().toUpperCase()
                                                    }
                                                </div>
                                        }
                                        <div className={`h-[10px] w-[10px] ${directMessagesContactsLiveStatus?.includes(contact._id) ? "bg-green-600" : "bg-red-600 "} rounded-3xl absolute right-0 bottom-0`}></div>
                                    </Avatar>
                                )
                            }
                            {
                                isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
                            }
                            {
                                isChannel ? <span className="truncate" >{contact.name}</span> : <span className="truncate">{contact.firstName ? `${contact.firstName} ${contact.lastName}` : `${contact.email}`}</span>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default ContactList;
