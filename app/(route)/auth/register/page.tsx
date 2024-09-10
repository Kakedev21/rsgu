
import Image from "next/image";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/config/authOptions";
import RegisterForm from "./_components/RegisterForm";
export const metadata: Metadata = {
    title: "Registration",
    description: "Authentication forms built using the components.",
  };
  
const RegisterPage = async () => {
    const session = await getServerSession(authOptions);
    if (["admin", "root"].includes(session?.user?.role as string)) {
        return redirect("/admin")
    }
    if (["cashier", "root"].includes(session?.user?.role as string)) {
        return redirect("/cashier")
    }
    if (session) redirect("/shop");
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
                <RegisterForm/>
            </div>
        </div>
    )
}

export default RegisterPage;