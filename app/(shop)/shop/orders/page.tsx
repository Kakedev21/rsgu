import { ChevronRight, ClipboardList, Store } from "lucide-react";
import Link from "next/link";
import OrdersList from "./_components/OrdersList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";

const OrdersPage = async () => {
    const session = await getServerSession(authOptions);
    console.log("sesion", session)
    return <div className="space-y-5 overflow-scroll">
       <div className="bg-white rounded p-5  flex items-center gap-3">
            <Link href="/shop" className="flex items-center gap-3">
                <Store />
                <p className="font-semibold text-lg text-slate-700">Shop</p>
            </Link>
            <div className="flex items-center gap-3">
                <ChevronRight />
            </div>
            <div className="flex items-center gap-3">
                <ClipboardList className="text-slate-500"/>
                <p className="font-semibold text-lg text-slate-500">Orders</p>
            </div>
        </div> 
        <div>
            <OrdersList user_id={session?.user?.session_id as string}/>
        </div>
    </div>
}


export default OrdersPage;