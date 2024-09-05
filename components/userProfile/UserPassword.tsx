'use client'

import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useUser, { useUserState } from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";

const UserPassword = () => {
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmNewPasswordRef = useRef<HTMLInputElement>(null);
    const session = useSession();
    const userHook = useUser({init: false});
    const userState = useUserState();
    const { toast }  = useToast();
    const [error, setError] = useState<string | null>(null);
    const checkPassword = () => {
        return newPasswordRef?.current?.value === confirmNewPasswordRef?.current?.value;
    }
    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    }
      
    const handleUpdatePassword = async () => {
        if (!checkPassword()) {
            return setError("New Password and Confirm Password does not match");
        }
        if (!validatePassword(confirmNewPasswordRef?.current?.value as string)) {
            return setError("Password must atleast 8 character or contains atleast one Uppercase and Lowercase and Number");
        }
        const payload = {
            name: session.data?.user.name as string,
            email: session.data?.user.email as string,
            username: session.data?.user.username as string,
            role:  session.data?.user.role as string,
            password: confirmNewPasswordRef?.current?.value as string
        }
        await userHook.update(payload, session.data?.user?.session_id as string);
        toast({
            title: "Success",
            description: `Password updated successfully`,
            duration: 1500
        });
        userState.setOpenProfile(false);
    }
    return (
        <div className="w-full flex flex-col gap-4 mt-5">
            {!!error && <div>
                <span className="text-xs text-red-500">{error}</span>
            </div>}
            <div>
                <Label>New Password</Label>
                <Input ref={newPasswordRef} placeholder="*******"/>
            </div>

            <div>
                <Label>Confirm Password</Label>
                <Input ref={confirmNewPasswordRef} placeholder="*******"/>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleUpdatePassword}>
                    Save
                </Button>
            </div>
        </div>
    );
}
 
export default UserPassword;