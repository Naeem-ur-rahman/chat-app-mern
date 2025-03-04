import { useAppStore } from "@/store";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from 'react-icons/io5'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState(userInfo.firstName || "");
    const [lastName, setLastName] = useState(userInfo.lastName || "");
    const [selectedColor, setSelectedColor] = useState(0);
    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSelectedColor(userInfo.color)
        }
        if (userInfo.image) {
            const imageUrl = `${HOST}/${userInfo.image}`;
            setImage(imageUrl);
        }
    }, [userInfo]);

    const validateProfileData = () => {
        if (!firstName) {
            toast.error("First Name is Required");
            return false;
        }

        if (!lastName) {
            toast.error("Last Name is Required");
            return false;
        }
        return true;
    }

    const saveChanges = async () => {
        if (validateProfileData()) {
            try {
                const response = await apiClient.post(UPDATE_PROFILE_ROUTE,
                    { firstName, lastName, color: selectedColor },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data) {
                    setUserInfo({ ...response.data });
                    toast.success("Profile Updated Successfully");
                    navigate('/chat');
                }
            } catch (error) {
                console.log({ error });
            }
        }
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    }

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        console.log({ file })
        if (file) {
            const formData = new FormData();
            formData.append("profile-image", file)
            const responce = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,
                formData,
                { withCredentials: true });
            if (responce.status === 200 && responce.data.image) {
                setUserInfo({ ...userInfo, image: responce.data.image })
                toast.success("Image Added SuccessFully")
            } else {
                console.log({ responce })
            }
        }
    }

    const handleDeleteImage = async () => {
        try {
            const responce = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
            if (responce.status === 200) {
                setUserInfo({ ...userInfo, image: null });
                toast.success("Image Removed SuccessFully.")
                setImage(null);
            }
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
            <div className="flex flex-col gap-10 w-[95vw] md:w-max">
                <div className="gap-5 flex flex-col">
                    <IoArrowBack onClick={() => navigate('/chat')} className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
                    <div className="grid grid-cols-2">
                        <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <Avatar className="w-32 h-32 md:w-48 md:h-48">
                                {
                                    image ?
                                        <AvatarImage src={image} alt="Profile" className="object-cover h-full w-full rounded-full bg-black" />
                                        :
                                        <div className={`w-32 h-32 md:w-48 md:h-48 text-5xl border-[1px] rounded-full flex items-center justify-center ${getColor(selectedColor)}`}>
                                            {
                                                firstName ?
                                                    firstName?.split('').shift()
                                                    :
                                                    userInfo.email?.split('').shift().toUpperCase()
                                            }
                                        </div>
                                }
                            </Avatar>
                            {
                                hovered && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer rounded-full "
                                        onClick={image ? handleDeleteImage : handleFileInputClick}
                                    >
                                        {image ? <FaTrash className="text-white cursor-pointer text-3xl" /> : <FaPlus className="text-white cursor-pointer text-3xl" />}
                                    </div>
                                )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleImageChange}
                                name="profile-image"
                                accept=".jpg, .png, .jpeg, .svg, .webp"
                            />
                        </div>
                        <div className="flex min-w-32 md:min-w-64 flex-col gap-3 md:gap-5 text-white items-center justify-center">
                            <div className="w-full">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    disabled
                                    value={userInfo.email}
                                    className="rounded-lg p-4 bg-[#2c2e3b] border-none"
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    placeholder="First Name"
                                    type="text"
                                    onChange={e => setFirstName(e.target.value)}
                                    value={firstName || ""}
                                    className="rounded-lg p-4 bg-[#2c2e3b] border-none"
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    placeholder="Last Name"
                                    type="text"
                                    onChange={e => setLastName(e.target.value)}
                                    value={lastName || ""}
                                    className="rounded-lg p-4 bg-[#2c2e3b] border-none"
                                />
                            </div>
                            <div className="w-full flex gap-2 justify-around md:justify-normal md:gap-5">
                                {
                                    colors.map((color, index) =>
                                    (<div className={`${color} w-8 h-8 rounded-full cursor-pointer transition-all duration-300 
                                    ${selectedColor === index ?
                                            "outline outline-1 outline-white" : ""
                                        }
                                    `}
                                        key={index}
                                        onClick={() => (setSelectedColor(index))}
                                    ></div>))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <Button className="h-12 md:h-16 w-full bg-purple-700 hover:bg-purple-900 cursor-pointer transition-all duration-300"
                            onClick={saveChanges}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;