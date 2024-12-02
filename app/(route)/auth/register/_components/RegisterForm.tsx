"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import CryptoJS from "crypto-js"
import { Eye, EyeOff, Store } from "lucide-react";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import emailjs from '@emailjs/browser';

const RegisterForm = () => {
  const userHook = useUser({ init: false });
  const searchParams = useSearchParams();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const srCodeRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const contactNumberRef = useRef<HTMLInputElement>(null);

  const [passwordType, setPasswordType] = useState<string>("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState<string>("password");
  const [department, setDepartment] = useState<string>()
  const [course, setCourse] = useState<string>()
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const coursesByDepartment: { [key: string]: string[] } = {
    'CABEIHM': [
      'Bachelor of Science in Management Accounting',
      'Bachelor of Science in Business Administration',
      'Bachelor of Science in Hospitality Management',
      'Bachelor of Science in Tourism Management'
    ],
    'CICS': [
      'Bachelor of Science in Information Technology',
      'BSIT (Business Analytics)',
      'BSIT (Network Technology)',
      'BSIT ( Service Management)'
    ],
    'CET': [
      'Bachelor of Computer Engineering Technology',
      'Bachelor of Food Engineering Technology',
      'Bachelor of Civil Engineering Technology',
      'Bachelor of Electrical Engineering Technology',
      'Bachelor of Electronics Engineering Technology',
      'Bachelor of Mechanical Engineering Technology',
      'Bachelor of Mechatronics Engineering Technology',
      'Bachelor of Automotive Engineering Technology',
      'Bachelor of Drafting Engineering Technology'
    ],
    'CAS': [
      'Bachelor of Science in Psychology'
    ],
    'CCJE': [
      'Bachelor of Science in Criminology'
    ],
    'CTE': [
      'Bachelor of Secondary Education ( Social Studies)',
      'Bachelor of Secondary Education ( English)',
      'Bachelor of Secondary Education ( Filipino)',
      'Bachelor of Secondary Education ( Mathematics)',
      'Bachelor of Secondary Education ( Science)',
      'Bachelor of Elementary Education',
      'Bachelor of Physical Education'
    ]
  };

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: nameRef?.current?.value,
      username: emailRef.current?.value as string,
      email: emailRef.current?.value,
      department: department as string,
      role: "user",
      password: passwordRef.current?.value,
      course: course,
      contactNumber: contactNumberRef.current?.value,
      srCode: srCodeRef.current?.value,
    }
    if (!/^[a-zA-Z0-9._%+-]+@g\.batstate-u\.edu\.ph$/.test(payload.email as string)) {
      setLoading(false);
      return toast({
        title: "Email should only contain @g.batstate-u.edu.ph",
        variant: "destructive"
      })
    }
    if (!/^(?:\+63|0)?9\d{9}$/.test(payload.contactNumber as string)) {
      setLoading(false);
      return toast({
        title: "Invalid contact number",
        variant: "destructive"
      })
    }
    if (payload.password !== confirmPasswordRef.current?.value || (payload.password?.length || 0) < 8) {
      setLoading(false);
      return toast({
        title: "Password does not match",
        variant: "destructive"
      })
    }
    if (!Object.values(payload).every(val => !!val)) {
      setLoading(false);
      return toast({
        title: "Registration Failed",
        description: "Please fill out all the fields",
        variant: "destructive"
      })
    }

    const response = await userHook.create(payload);
    const emailResponse = await userHook.emailVerification(payload.email as string)
    if (emailResponse.emailVerification) {
      const res = await emailjs.send('service_7qol6gv', 'template_eqez7ya', {
        user_email: payload.email,
        emailVerification: emailResponse.emailVerification,
      }, {
        publicKey: 'DL0gCccNkjcEvSL01'
      })
      console.log("res", res)
    }
    console.log("Email", emailResponse)
    setLoading(false);
    if (response?.user) {
      toast({
        title: "Registration Successfull",
        description: "Please check your email for verification"
      });
      router.push("/auth/login")
    } else {
      toast({
        title: response.error?.code === 11000 ? "Email already exist" : "Registration Failed",
        description: response?.error?.message,
        variant: "destructive"
      })
    }
  }
  return (
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
          <p className="text-slate-600 font-semibold text-2xl">User Registration</p>
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Name</Label>
          <Input className="w-full  sm:w-[400px]" ref={nameRef} disabled={loading} placeholder="Full name" />
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Department</Label>
          <Select onValueChange={(value) => {
            setDepartment(value);
            setCourse(undefined);
          }}>
            <SelectTrigger className="w-full sm:w-[400px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CABEIHM">CABEIHM</SelectItem>
              <SelectItem value="CICS">CICS</SelectItem>
              <SelectItem value="CET">CET</SelectItem>
              <SelectItem value="CAS">CAS</SelectItem>
              <SelectItem value="CCJE">CCJE</SelectItem>
              <SelectItem value="CTE">CTE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Course</Label>
          <Select onValueChange={(value) => setCourse(value)} value={course}>
            <SelectTrigger className="w-full sm:w-[400px]" disabled={!department}>
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {department && coursesByDepartment[department]?.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full px-5">
          <Label className="text-slate-500">SR Code</Label>
          <Input className="w-full  sm:w-[400px]" ref={srCodeRef} disabled={loading} />
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Email</Label>
          <Input className="w-full  sm:w-[400px]" ref={emailRef} disabled={loading} placeholder="john_doe@g.batstate-u.edu.ph" />
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Contact Number</Label>
          <Input className="w-full  sm:w-[400px]" ref={contactNumberRef} disabled={loading} placeholder="09123456789" />
        </div>

        <div className="w-full px-5">
          <Label className="text-slate-500">Password</Label>

          <div className="relative flex items-center border border-slate-200 rounded pr-3">
            <Input className="w-full  border-none" type={passwordType} ref={passwordRef} disabled={loading} placeholder="********" />
            {passwordType === "text" && <div onClick={() => setPasswordType("password")}><Eye className="text-slate-500" size={18} /></div>}
            {passwordType === "password" && <div onClick={() => setPasswordType("text")}><EyeOff className="text-slate-500" size={18} /></div>}
          </div>
        </div>
        <div className="w-full px-5">
          <Label className="text-slate-500">Confirm Password</Label>
          <div className="relative flex items-center border border-slate-200 rounded pr-3">
            <Input className="w-full  border-none" type={confirmPasswordType} ref={confirmPasswordRef} disabled={loading} placeholder="********" />
            {confirmPasswordType === "text" && <div onClick={() => setConfirmPasswordType("password")}><Eye className="text-slate-500" size={18} /></div>}
            {confirmPasswordType === "password" && <div onClick={() => setConfirmPasswordType("text")}><EyeOff className="text-slate-500" size={18} /></div>}
          </div>

        </div>
        <div className="w-full flex-col gap-3 px-5">
          <Button className="w-full" variant="destructive" type="submit" disabled={loading}>
            Register
          </Button>
          <div className=" mt-3 flex gap-1 justify-center">
            <p className="text-xs">Already have an Account</p>
            <Link href="/auth/login" className="text-xs text-blue-500">Login</Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
