import { useEffect, useState } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_DM_ROUTE, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import "@/assets/scrollbar.css"
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-channel";
import { useSocket } from "@/context/SocketContext";
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'

const ContactsContainer = () => {

    const { setDirectMessagesContacts, directMessagesContacts, channels, setChannels, userInfo } = useAppStore();
    const socket = useSocket();
    const [contactsShow, setContactsShow] = useState(true);
    const [channelShow, setChannelShow] = useState(true);

    useEffect(() => {
        const getContacts = async () => {
            try {
                const response = await apiClient.get(GET_CONTACTS_DM_ROUTE, { withCredentials: true });
                if (response.status === 200 && response.data.contacts) {
                    setDirectMessagesContacts(response.data.contacts);
                }
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

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

        getContacts();
        getChannels();

    }, [setChannels, setDirectMessagesContacts, socket, userInfo.id]);

    // Separate useEffect to handle socket emit when directMessagesContacts updates
    useEffect(() => {
        if (socket && directMessagesContacts.length > 0) {
            socket.emit("send-contacts-for-live-status", {
                contacts: directMessagesContacts.map((contact) => contact._id),
                user: userInfo.id,
            });
        }
    }, [socket, directMessagesContacts, userInfo.id]);

    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] pb-16 border-r-2 border-[#2f303b] w-full h-[100vh] overflow-hidden">
            <div className="pt-3">
                <Logo />
            </div>
            <div className="my-5">
                <div className="flex items-center justify-start py-2 ">
                    <button className="flex items-center justify-between pl-5 "
                        onClick={() => setContactsShow(!contactsShow)}
                    >
                        {
                            contactsShow
                                ? <IoMdArrowDropup />
                                : <IoMdArrowDropdown />
                        }
                    </button>
                    <div className="flex items-center justify-start w-[100%]">
                        <button onClick={() => setContactsShow(!contactsShow)} >
                            <Title text="Direct Messages" />
                        </button>
                        <NewDM />
                    </div>
                </div>
                <div className={`${contactsShow ? " max-h-[30vh]" : " hidden"} overflow-y-auto scrollbar`}>
                    <ContactList contacts={directMessagesContacts} />
                </div>
            </div>
            <div className="my-5">
                <div className="flex items-center justify-start py-2 pr-10">
                    <button className="flex items-center justify-between pl-5 "
                        onClick={() => setChannelShow(!channelShow)}
                    >
                        {
                            channelShow
                                ? <IoMdArrowDropup />
                                : <IoMdArrowDropdown />
                        }
                    </button>
                    <div className="flex items-center justify-start w-[100%]">
                        <button onClick={() => setChannelShow(!channelShow)} >
                            <Title text="Channels" />
                        </button>
                        <CreateChannel />
                    </div>
                </div>
                <div className={`${channelShow ? " max-h-[30vh]" : " hidden "} overflow-y-auto scrollbar`}>
                    <ContactList contacts={channels} isChannel={true} />
                </div>
            </div>
            <ProfileInfo />
        </div>
    );
}

export default ContactsContainer;

const Logo = () => {
    return (
        <div className="flex p-5  justify-start items-center gap-2">
            <svg
                id="logo-38"
                width="78"
                height="32"
                viewBox="0 0 78 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {" "}
                <path
                    d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
                    className="ccustom"
                    fill="#8338ec"
                ></path>{" "}
                <path
                    d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
                    className="ccompli1"
                    fill="#975aed"
                ></path>{" "}
                <path
                    d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
                    className="ccompli2"
                    fill="#a16ee8"
                ></path>{" "}
            </svg>
            <span className="text-3xl font-semibold ">Syncronus</span>
        </div>
    );
};

const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-5  pr-5 font-light text-opacity-90 text-sm">
            {text}
        </h6>
    )
}