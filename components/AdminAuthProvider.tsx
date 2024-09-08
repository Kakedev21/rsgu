import { authOptions } from "@/config/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface AdminAuthProviderProps {
    children: ReactNode;
}

const AdminAuthProvider: FC<AdminAuthProviderProps> = async ({children}) => {
    const session = await getServerSession(authOptions);
    if (["admin", "root"].includes(session?.user?.role as string)) {
        return <>
            {children}
        </>
    }

    if (session?.user?.role === "cashier") {
        redirect("/cashier")
    }
}


export default AdminAuthProvider;