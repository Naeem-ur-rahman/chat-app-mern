import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie2 from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDM = () => {
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const { setSelectedChatType, setSelectedChatData } = useAppStore();

    const SearchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const responce = await apiClient.post(
                    SEARCH_CONTACTS_ROUTE,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (responce.status === 200 && responce.data.contacts) {
                    setSearchedContacts(responce.data.contacts);
                } else {
                    setSearchedContacts([])
                }
            } else {
                setSearchedContacts([])
            }
        } catch (error) {
            console.log({ error })
        }
    };

    const selectSearchedContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType('contact');
        setSelectedChatData(contact);
        setSearchedContacts([]);
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 duration-300 transition-all"
                            onClick={() => setOpenNewContactModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-[#1c1b1e] border-none">Select New Contact </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#1c1d25] border-none text-white w-[350px] h-[350px]  md:w-[400px] md:h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center">Please Select a Contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Seacrch Contacts"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => SearchContacts(e.target.value)}
                        />
                    </div>
                    {searchedContacts.length > 0 && (
                        <ScrollArea className="h-[250px]">
                            <div className="flex flex-col gap-5">
                                {
                                    searchedContacts.map((contact) => (
                                        <div key={contact._id} onClick={() => selectSearchedContact(contact)} className="flex gap-3 items-center cursor-pointer">
                                            <div className="w-12 h-12 relative">

                                                <Avatar className="w-12 h-12">
                                                    {
                                                        contact.image ?
                                                            <AvatarImage src={`${HOST}/${contact.image}`} alt="Profile" className="object-cover h-full w-full rounded-full bg-black" />
                                                            :
                                                            <div
                                                                className={`w-12 h-12 text-lg border-[1px] rounded-full flex items-center justify-center ${getColor(contact.color)}`}>
                                                                {
                                                                    contact.firstName ?
                                                                        contact.firstName?.split('').shift()
                                                                        :
                                                                        contact.email?.split('').shift().toUpperCase()
                                                                }
                                                            </div>
                                                    }
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>
                                                    {
                                                        contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                                    }
                                                </span>
                                                <span className="text-xs">
                                                    {
                                                        contact.email
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                    ))
                                }
                            </div>
                        </ScrollArea>
                    )}
                    {searchedContacts.length <= 0 && (
                        <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-1000 transition-all">
                            <Lottie2
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                                <h3 className="poppins-medium">
                                    Hi<span className="text-purple-500">! </span>
                                    Search new
                                    <span className="text-purple-500"> Contact</span>
                                    <span className="text-purple-500">.</span>
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </>
    );
}

export default NewDM;
