import Victory from "@/assets/victory.svg"
import Background from "@/assets/login2.png"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email Required")
            return false
        }
        if (!password.length) {
            toast.error("Password Required")
            return false
        }
        if (confirmPassword !== password) {
            toast.error("Confirm Password Should be same.")
            return false
        }
        return true
    }
    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email Required")
            return false
        }
        if (!password.length) {
            toast.error("Password Required")
            return false
        }
        return true
    }
    const handleLogin = async () => {
        if (validateLogin()) {
            try {
                const response = await apiClient.post(
                    LOGIN_ROUTE,
                    { email, password },
                    { withCredentials: true }
                );

                if (response.data.user.id) {
                    setUserInfo(response.data.user)
                    if (response.data.user.profileSetup) navigate('/chat')
                    else navigate('/profile')
                }
                console.log(response)
            } catch (error) {
                toast.error(error.response.data.error || error.response.data)
                console.log(error)
            }
        }
    }
    const handleSignup = async () => {
        if (validateSignup()) {
            try {
                const response = await apiClient.post(
                    SIGNUP_ROUTE,
                    { email, password },
                    { withCredentials: true }
                );
                if (response.status === 201) {
                    setUserInfo(response.data.user)
                    navigate('/profile')
                }
                console.log(response)
            } catch (error) {
                toast.error(error.response.data.error || error.response.data)
                console.log(error)
            }
        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex justify-center items-center">
            <div className="h-[90vh] w-[95vw] md:w-{80vw} p-3 md:p-5 bg-white border-2 border-white shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-2xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center flex-col justify-center">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="victory emogi" className="h-[100px]" />
                        </div>
                        <p className="font-medium text-center">
                            Fill in the details to get started with best chat app!
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs defaultValue="login" className="w-[90%] md:w-3/4">
                            <TabsList className="w-full rounded-none bg-transparent">
                                <TabsTrigger value="login"
                                    className="data-[state=active]:bg-transparent text-black opacity-90 rounded-none border-b-2 w-full data-[state=active]:text-black data-[state=active]:border-b-purple-500 data-[state=active]:font-semibold p-3 transition-all duration-300"
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger value="signup"
                                    className="data-[state=active]:bg-transparent text-black opacity-90 rounded-none border-b-2 w-full data-[state=active]:text-black data-[state=active]:border-b-purple-500 data-[state=active]:font-semibold p-3 transition-all duration-300"
                                >
                                    Signup
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="flex flex-col mt-10 gap-5">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-full p-3"
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="rounded-full p-3"
                                />
                                <Button className="rounded-full p-4" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent value="signup" className="flex flex-col gap-5">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-full p-3"
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="rounded-full p-3"
                                />
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="rounded-full p-3"
                                />
                                <Button className="rounded-full p-4" onClick={handleSignup}>Signup</Button>
                            </TabsContent>
                        </Tabs>

                    </div>
                </div>
                <div className="hidden xl:flex items-center justify-center">
                    <img src={Background} alt="background Image" className=" p-3" />
                </div>
            </div>
        </div>
    );
}

export default Auth;
