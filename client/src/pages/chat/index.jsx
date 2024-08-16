import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
    const navigate = useNavigate();
    const { userInfo } = useAppStore();
    useEffect(() => {
        if (!userInfo.profileStatus) {
            toast("Please Setup Profile to continue.")
            navigate('/profile')
        }
    }, [navigate, userInfo])
    return (
        <div>
            Chat
        </div>
    );
}

export default Chat;