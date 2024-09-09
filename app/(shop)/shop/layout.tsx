import AxiosInterceptor from "@/components/axiosInterceptor";
import Providers from "../../(route)/admin/(dashboard)/providers";
import Image from "next/image";

import UserProfile from "@/components/userProfile/Profile";
import User from "@/app/(route)/admin/(dashboard)/user";
import { Toaster } from "@/components/ui/toaster";
import { User2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import CartItem from "./_components/CartItem";

const ShopLayout = async ({children} :  {
    children: React.ReactNode;
  }) => {
    const session = await getServerSession(authOptions);
    console.log("session", session)
    return <Providers>
             <AxiosInterceptor/>
             <main className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 py-3 border-b bg-red-500 px-4 sm:static sm:h-auto sm:border-0 sm:px-6 shadow-lg rounded-b">
                <div className="flex-1 flex items-center gap-x-5">
                  <Image
                    src="/rgo_logo.png"
                    width={48}
                    height={48}
                    alt="logo"
                    className="block"
                  />
                  <div className="space-y-0">
                    <p className="text-lg text-slate-100 font-semibold p-0 m-0 flex flex-col">
                      Bantangas State University
                      <span className="text-xs text-slate-100">Leading Innovations, Transforming Lives</span>
                    </p>
                  
                  </div>
                </div>
                <div className="flex gap-5 items-center">
                  <CartItem/>
                  {session?.user ? <User /> : <div className="border-b border-transparent group hover:border-white transition-all duration-300 p-2">
                    <User2 className="text-slate-50 cursor-pointer"/>
                  </div>}
                  <UserProfile/>
                </div>
              </header>
              <main className="grid flex-1 items-start gap-2 p-5 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
                {children}
              </main>
            </div>
            <Toaster />
          </main>
    </Providers>
}


export default ShopLayout;