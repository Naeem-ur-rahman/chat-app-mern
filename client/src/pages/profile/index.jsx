import { useAppStore } from "@/store";

const Profile = () => {
    const { userInfo } = useAppStore()
    return (
        <div>
            <div>Email {userInfo?.email}</div>
            <div>Email {userInfo?.id}</div>
            Profile
        </div>
    );
}

export default Profile;