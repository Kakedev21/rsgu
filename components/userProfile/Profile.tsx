
'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useUserState } from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { Avatar, AvatarFallback } from "../ui/avatar";
import UserAccount from "./UserAccount";
import UserPassword from "./UserPassword";
  

const UserProfile = () => {
    const userState = useUserState();
    const session = useSession();
    return (
        <Dialog open={userState.openProfile} onOpenChange={(value) => userState.setOpenProfile(value)}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="w-full flex items-center gap-2 border-b pb-3">
                    <Avatar className="outline outline-green-500">
                        <AvatarFallback className="text-xs">{session.data?.user?.name?.split(" ").map((n)=>n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    {session.data?.user.name}
                </DialogTitle>
                </DialogHeader>
                <div>
                    <Tabs defaultValue="account" className="w-full">
                        <TabsList>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account" className="w-full">
                            <UserAccount/>
                        </TabsContent>
                        <TabsContent value="password">
                            <UserPassword/>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
 
export default UserProfile;