"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useOrder from "@/hooks/useOrder";
import { OrderProps } from "@/types/Order";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { times } from "lodash";
import moment from "moment";
import { useSession } from "next-auth/react";
import numeral from "numeral";
import { useEffect } from "react";

const TransactionDrawer = () => {
    const orderHook = useOrder({init: false});
    const session  = useSession();
    useEffect(() => {
        if (!orderHook.transactions) {
            orderHook.getTransactions(session.data?.user?.session_id as string);
        }
    }, [])
    console.log("orderHook", orderHook.transactions)
    if (orderHook.loading) {
        return <div className="space-y-2">
            {
                orderHook.loading && times(3).map(count => (
                    <Skeleton className="w-full h-20" key={count}/>
                ))
            }
            
        </div>
    }
    return (
        <ScrollArea className="h-[500px] w-full ">
            {
                orderHook.transactions?.map(item => (
                    <div key={item?.["_id"]} className=" p-5 space-y-3">
                        <p className="font-semibold pb-2">{moment(item?.["_id"]).format("LL")}</p>
                        {
                            item?.orders?.map((order: OrderProps) => (
                                <div key={order?.["_id"]} className="bg-slate-50 p-3 ml-5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex  gap-2">
                                            <p>Order No:</p>
                                            <p className="font-semibold">{order?.["_id"]?.slice(-8)}</p>
                                        </div>
                                        <div className="flex flex-col justify-end items-end">
                                            <p className="font-semibold">₱{numeral(order?.totalAmount).format("0,0.00")}</p>
                                            <p className="text-green-500 font-bold">{order?.status}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </ScrollArea>
    );
}
 
export default TransactionDrawer;