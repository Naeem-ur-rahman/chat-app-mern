import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            const responce = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true })
            if (responce.status === 200) {
                navigate('/auth');
                setUserInfo(null)
            }
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-5 w-full bg-[#2a2b33]">

            <div className="flex gap-3 items-center justify-center overflow-hidden">
                <div className="w-12 h-12 relative">
                    <Avatar className="w-12 h-12">
                        {
                            userInfo.image ?
                                <AvatarImage src={`${HOST}/${userInfo.image}`} alt="Profile" className="object-cover h-full w-full rounded-full bg-black" />
                                :
                                <div
                                    className={`w-12 h-12 text-lg border-[1px] rounded-full flex items-center justify-center ${getColor(userInfo.color)}`}>
                                    {
                                        userInfo.firstName ?
                                            userInfo.firstName?.split('').shift()
                                            :
                                            userInfo.email?.split('').shift().toUpperCase()
                                    }
                                </div>
                        }
                    </Avatar>
                </div>
                <div className="truncate">
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className="flex gap-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-purple-500 text-xl font-medium"
                                onClick={() => navigate('/profile')}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="text-white bg-[#1c1b1e] border-none">Edit Profile</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className="text-red-500 text-xl font-medium"
                                onClick={handleLogOut}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="text-white bg-[#1c1b1e] border-none">Logout</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}

export default ProfileInfo;
