"use client"

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import useUser from "@/hooks/useUser";
import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ForgotPasswordForm = () => {
  const userHook = useUser({ init: false });
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const passwordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState<string>("password");
  const [newPasswordType, setNewPasswordType] = useState<string>("password");

  const handleForgotPassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newPassword = newPasswordRef.current?.value;
      const password = passwordRef.current?.value ?? '';
      if (newPassword && password) {
        const res = await userHook.resetPassword(password, newPassword, token ?? '');
        if (res && res.status === 200) {
          toast({
            variant: "default",
            title: "Password Reset",
            description: res.message,
          });
          router.push('/auth/login');
        } else {
          toast({
            variant: 'destructive',
            title: 'Password reset failed',
            description: res.message
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: 'Your request has expired or already been used. Please request a new one.',
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleForgotPassword} className="my-5 mx-5 sm:flex sm:justify-center bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-1/3 items-center sm:shadow-2xl">
      <div className="mb-10 space-y-5">
        <div className="w-full flex justify-center">
          <p className="text-slate-600 font-semibold text-2xl mt-5">Enter your new password below.</p>
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Current Password</Label>
          <div className="relative flex items-center border border-slate-200 rounded pr-3">
            <Input className="w-full sm:w-[400px] border-none" type={passwordType} ref={passwordRef} disabled={loading} />
            {passwordType === "text" ? (
              <Eye className="text-slate-500" size={18} onClick={() => setPasswordType("password")} />
            ) : (
              <EyeOff className="text-slate-500" size={18} onClick={() => setPasswordType("text")} />
            )}
          </div>
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">New Password</Label>
          <div className="relative flex items-center border border-slate-200 rounded pr-3">
            <Input className="w-full sm:w-[400px] border-none" type={newPasswordType} ref={newPasswordRef} disabled={loading} />
            {newPasswordType === "text" ? (
              <Eye className="text-slate-500" size={18} onClick={() => setNewPasswordType("password")} />
            ) : (
              <EyeOff className="text-slate-500" size={18} onClick={() => setNewPasswordType("text")} />
            )}
          </div>
        </div>
        <div className="w-full flex-col gap-3 px-5">
          <Button className="w-full" variant="destructive" type="submit" disabled={loading}>
            Update
          </Button>
        </div>
      </div>
    </form>
  );
};

const ForgotPasswordPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ForgotPasswordForm />
  </Suspense>
);

export default ForgotPasswordPage;
