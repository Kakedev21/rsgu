"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { sendForgotPassword } from "@/hooks/useUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CryptoJS from "crypto-js"
import { Eye, EyeOff, Store } from "lucide-react";
import Link from "next/link";
import emailjs from '@emailjs/browser';

const LoginForm = () => {
  const searchParams = useSearchParams();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('')
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState<string>("password");
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

    console.log("R", result)

    if (result.status === 401) {
      setLoading(false)
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Invalid credentials",

      })
    }
    console.log("result", result)
    if (searchParams.get("callbackUrl")) {
      router.replace(searchParams.get("callbackUrl") as string)
    } else {
      const parseUrl = new URL(result.url as string);
      const callbackUrl = parseUrl.searchParams.get('callbackUrl');
      const decodedCallbackUrl = callbackUrl ? new URL(decodeURIComponent(callbackUrl as string) || "") : { pathname: "/" };
      if (decodedCallbackUrl.pathname === "/") {
        window.location.reload()
      } else {
        router.replace(decodedCallbackUrl?.pathname || "/admin")
      }
    }
  }

  const handleSendForgotPassword = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      const passwordLink = await sendForgotPassword(forgotPasswordEmail)
      if (passwordLink.passwordLink) {
        const emailreps = await emailjs.send(
          'service_7qol6gv',
          'template_fnpqzra',
          {
            passwordLink: passwordLink.passwordLink,
            user_email: forgotPasswordEmail,
            from_email: 'rgo.malvar@g.batstate-u.edu.ph'
          },
          {
            publicKey: 'DL0gCccNkjcEvSL01'
          }
        );
        console.log("Email sent successfully:", emailreps);

      }

      toast({
        variant: "default",
        title: "Password reset link sent, please check your email",
      });
      setForgotPasswordEmail("");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: "Please try again later",
      });
    }
  }
  return (
    <>
      <form onSubmit={handleLogin} className="my-5 mx-5  sm:flex sm:justify-center bg-white  rounded-t-3xl sm:rounded-3xl  w-full sm:w-1/3 items-center sm:shadow-2xl">
        <div className="mb-10 space-y-5">
          <div className="px-5 mt-5">
            <Link href="/shop" className="w-full">
              <p className="text-slate-600 font-semibold flex items-center gap-2">
                <Store size={18} />
                Shop
              </p>
            </Link>
          </div>
          <div className="w-full flex justify-center">
            <p className="text-slate-600 font-semibold text-2xl">Welcome back!</p>
          </div>
          <div className="w-full px-5">
            <Label className="text-slate-500">Username/Email</Label>
            <Input className="w-full " ref={usernameRef} disabled={loading} />
          </div>
          <div className="w-full px-5">
            <Label className="text-slate-500">Password</Label>
            <div className="relative flex items-center border border-slate-200 rounded pr-3">
              <Input className="w-full  sm:w-[400px] border-none" type={passwordType} ref={passwordRef} disabled={loading} />
              {passwordType === "text" && <div onClick={() => setPasswordType("password")}><Eye className="text-slate-500" size={18} /></div>}
              {passwordType === "password" && <div onClick={() => setPasswordType("text")}><EyeOff className="text-slate-500" size={18} /></div>}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant='ghost' className="text-right text-xs pt-3 text-blue-500 cursor-pointer">Forgot Password</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-slate-600">Forgot Password</DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Input email here to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-3">
                    <Label htmlFor="name" className="text-left text-slate-500">
                      Email
                    </Label>
                    <Input
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      id="name"
                      className="col-span-2"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSendForgotPassword} disabled={loading} variant='destructive' type="button">Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full flex-col gap-3 px-5">
            <Button className="w-full" variant="destructive" type="submit" disabled={loading}>
              Login
            </Button>
            <div className=" mt-3 flex gap-1 justify-center">
              <p className="text-xs">Create New Account</p>
              <Link href="/auth/register" className="text-xs text-blue-500">Register</Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
