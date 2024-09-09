'use client'

import { HousePlug } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  
  useEffect(() => {
    setTimeout(() => {
      if (!session.data?.user) {
        router.replace('/shop');
      }
      if (session.data?.user && ["root", "admin"].includes(session.data.user.role)) {
        router.push('/admin');
      }
      if (session.data?.user && ["cashier"].includes(session.data.user.role)) {
        router.push('/cashier');
      }
    }, 3000)
  }, [session.data?.user]);
  return (
    <div className="h-screen flex gap-3 items-center justify-center animate-pulse">
      <HousePlug/>
      <p >Loading please wait...</p>
    </div>
  );
}
