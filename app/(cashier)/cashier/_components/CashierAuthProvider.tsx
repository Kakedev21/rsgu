

import { authOptions } from "@/config/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface CashierAuthProviderProps {
    children: ReactNode
}


const CashierAuthProvider: FC<CashierAuthProviderProps> = async ({children}) => {
    const session = await getServerSession(authOptions);
    console.log("session", session);
    if (["cashier", "root"].includes(session?.user?.role as string)) {
        return <>
            {children}
        </>
    }

    if (session?.user?.role === "admin") {
        redirect("/admin")
    }

}


export default CashierAuthProvider;