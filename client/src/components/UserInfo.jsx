import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";

const UserInfo = ({ user }) => {
    return (
        <div className="flex gap-3 items-center">
            <div className="w-12 h-12 relative">

                <Avatar className="w-12 h-12">
                    {
                        user.image ?
                            <AvatarImage src={`${HOST}/${user.image}`} alt="Profile" className="object-cover h-full w-full rounded-full bg-black" />
                            :
                            <div
                                className={`w-12 h-12 text-lg border-[1px] rounded-full flex items-center justify-center ${getColor(user.color)}`}>
                                {
                                    user.firstName ?
                                        user.firstName?.split('').shift()
                                        :
                                        user.email?.split('').shift().toUpperCase()
                                }
                            </div>
                    }
                </Avatar>
            </div>
            <div className="flex flex-col">
                <span>
                    {
                        user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email
                    }
                </span>
                <span className="text-xs">
                    {
                        user.email
                    }
                </span>
            </div>
        </div>
    );
}

export default UserInfo;
