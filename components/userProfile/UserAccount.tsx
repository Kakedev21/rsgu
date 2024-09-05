'use client'

import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import useUser, { useUserState } from "@/hooks/useUser";
import { useToast } from "../ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const UserAccount = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const [department, setDepartment] = useState<string | null>(null);
    const session = useSession();
    const userHook = useUser({init: false});
    const userState = useUserState();
    const { toast }  = useToast();
    const handleSaveProfile = async() => {
        const payload = {
            name: nameRef?.current?.value,
            email: emailRef?.current?.value,
            username: usernameRef?.current?.value as string,
            role:  session.data?.user.role as string
        }

        const result = await userHook.update(payload, session.data?.user?.session_id as string);
        toast({
            title: "Success",
            description: `Profile updated successfully`,
            duration: 1500
        });
        userState.setOpenProfile(false);
    }
    console.log("session.data?.user.department", session.data?.user.department)
    return (
        <div className="w-full flex flex-col gap-4 mt-5">
            <div>
                <span className="text-xs">Need to login and logout after saving changes to refresh the profile</span>
            </div>
            <div>
                <Label>Name</Label>
                <Input ref={nameRef} defaultValue={session.data?.user.name as string}/>
            </div>

            <div>
                <Label>Email</Label>
                <Input ref={emailRef} defaultValue={session.data?.user.email as string}/>
            </div>
            <div>
                <Label>Username</Label>
                <Input ref={usernameRef} defaultValue={session.data?.user.username as string}/>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                    Save
                </Button>
            </div>
        </div>
    );
}
 
export default UserAccount;