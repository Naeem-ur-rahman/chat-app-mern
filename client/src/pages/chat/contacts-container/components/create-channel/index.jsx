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

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
// import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
    const [openNewChannelModal, setOpenNewChannelModal] = useState(false);
    // const [searchedContacts, setSearchedContacts] = useState([]);
    // const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, { withCredentials: true })
                if (response.status === 200 && response.data) {
                    setAllContacts(response.data.contacts)
                }
            } catch (error) {
                console.log({ error })
            }
        }
        getData();
    }, []);

    const createChannel = async () => { }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 duration-300 transition-all"
                            onClick={() => setOpenNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-[#1c1b1e] border-none">Create New Channel </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
                <DialogContent className="bg-[#1c1d25] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center">Fill up the details for new channel</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none text-white"
                            defaultOptions={allContacts}
                            placeholder="Search Contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-green-600">No results found</p>
                            }
                        />
                    </div>
                    <div>
                        <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={createChannel}
                        >Create Channel</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
}

export default CreateChannel;
