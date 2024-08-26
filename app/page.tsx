'use client'

import { HousePlug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    setTimeout(() => {
      router.push('/admin');
    }, 3000)
  }, []);
  return (
    <div className="h-screen flex gap-3 items-center justify-center animate-pulse">
      <HousePlug/>
      <p >Loading please wait...</p>
    </div>
  );
}
