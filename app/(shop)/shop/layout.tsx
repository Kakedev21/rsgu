import AxiosInterceptor from "@/components/axiosInterceptor";
import Providers from "../../(route)/admin/(dashboard)/providers";
import Image from "next/image";

import UserProfile from "@/components/userProfile/Profile";
import User from "@/app/(route)/admin/(dashboard)/user";
import { Toaster } from "@/components/ui/toaster";
import { HandCoins, User2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import CartItem from "./_components/CartItem";
import Link from "next/link";

const ShopLayout = async ({ children }: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession(authOptions);
  console.log("session", session)
  return <Providers>
    <AxiosInterceptor />
    <main className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 py-3 border-b bg-red-500 px-4 sm:static sm:h-auto sm:border-0 sm:px-6 shadow-lg rounded-b">
          <div className="flex-1 flex items-center gap-x-5">
            <Link href="/shop">
              <Image
                src="/rgo_logo.png"
                width={48}
                height={48}
                alt="logo"
                className="block"
              />
            </Link>
            <div className="space-y-0">
              <p className="text-xs sm:text-lg text-slate-100 font-semibold py-3 sm:p-0 m-0 flex flex-col">
                Bantangas State University
                <span className="text-[8px] sm:text-xs text-slate-100">Leading Innovations, Transforming Lives</span>
              </p>

            </div>
          </div>
          <div className="flex gap-5 items-center">
            {
              session?.user.role === "cashier" && <Link href="/cashier" className="border-b border-transparent group hover:border-white transition-all duration-300 p-2">
                <HandCoins className="text-slate-50 cursor-pointer" />
              </Link>
            }
            <CartItem />

            {session?.user ? <User /> : <Link href="/auth/login" className="border-b border-transparent group hover:border-white transition-all duration-300 p-2">

              <User2 className="text-slate-50 cursor-pointer" />

            </Link>}

            <UserProfile />
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