"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signIn, SignInResponse } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CryptoJS from "crypto-js"
const LoginForm = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("cred", usernameRef?.current?.value, passwordRef?.current?.value);
        const result = await signIn("credentials", {
            payload: CryptoJS.AES.encrypt(JSON.stringify({
              username: usernameRef?.current?.value,
              password: passwordRef?.current?.value
            }), process.env.NEXT_PUBLIC_AUTH_SECRET as string),
            redirect: false
          }) as SignInResponse;
          
          if (result.status === 401) {
            setLoading(false)
            return toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "Invalid credentials",
              
            })
          }
          const parseUrl = new URL(result.url as string);
          const callbackUrl = parseUrl.searchParams.get('callbackUrl');
          const decodedCallbackUrl = new URL(decodeURIComponent(callbackUrl as string));
          router.replace(decodedCallbackUrl.pathname || "/admin")
    }
  return (
    <form onSubmit={handleLogin} className="my-5 mx-5  sm:flex sm:justify-center bg-white  rounded-t-3xl sm:rounded-3xl  w-full sm:w-1/3 items-center sm:shadow-2xl">
      <div className="my-10 space-y-5">
        <div className="w-full flex justify-center">
          <p className="text-slate-600 font-semibold text-2xl">Welcome back!</p>
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Username</Label>
          <Input className="w-full  sm:w-[400px]" ref={usernameRef} disabled={loading}/>
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Password</Label>
          <Input className="w-full  sm:w-[400px]" type="password" ref={passwordRef}  disabled={loading}/>
        </div>
        <div className="w-full flex-col gap-3 px-5">
          <Button className="w-full" variant="destructive" type="submit"  disabled={loading}>
            Login
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
