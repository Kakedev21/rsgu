
import Image from "next/image";
import LoginForm from "./_components/LoginForm";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/config/authOptions";
export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
  };
  
const LoginPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) redirect("/admin");
    return (
        <div className="w-full h-screen bg-white relative">
            <div className=" h-1/2 bg-red-500 rounded-b-3xl"/>
            <div className="flex flex-col justify-center items-center absolute z-50 top-[5%] w-full r-0 l-0">
                <Image
                    src="/rgo_logo.png"
                    width={200}
                    height={200}
                    alt="Authentication"
                    className="block w-32 h-32 sm:w-[210px] sm:h-[200px] text-center"
                />
                <LoginForm/>
            </div>
        </div>
    )
}

export default LoginPage;