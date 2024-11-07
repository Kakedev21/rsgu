"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useOrder from "@/hooks/useOrder";
import { FC, useEffect } from "react";
import ConfirmReleaseOrder from "./ConfirmReleaseOrder";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import useReport from "@/hooks/useReport";

interface ReleaseOrderDetailProps {
    orderNo: string;
}
const ReleaseOrderDetail: FC<ReleaseOrderDetailProps> = ({ orderNo }) => {
    const orderHook = useOrder({ init: false });
    const reportHook = useReport()
    const session = useSession();
    const { toast } = useToast();

    const handleConfirm = async () => {

        await orderHook.confirmOrder({ status: "Completed", admin: session?.data?.user?.session_id as string }, orderHook?.order?.[0]?._id as string);

        await orderHook.orderDetail(orderNo as string)
        toast({
            title: "Order Completed"
        })

    }
    useEffect(() => {
        if (orderNo) {
            orderHook.orderDetail(orderNo as string);
        } else {
            orderHook.setOrder(null)
        }

    }, [orderNo])

    if (orderHook.loading) {
        return <Skeleton className="w-full h-10" />
    }
    if (!orderHook.order) {
        return <div className="flex justify-center">
            <p className="text-slate-600">No Order Found</p>
        </div>
    }
    console.log("order", orderHook.order)
    return (
        <div className="space-y-4">
            <div className="">
                <div className="flex gap-3">
                    <p>Order Details: </p>
                    <p className="font-semibold">{orderHook.order?.[0]._id?.slice(-8)}</p>
                </div>
                <p className="font-semibold text-green-500">{orderHook.order?.[0]?.status}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-3">
                    {
                        orderHook.order?.map(order => (
                            <div key={order?._id} className="bg-slate-50 rounded p-3">
                                <p className="font-semibold">{order?.products?.name}</p>
                                <p className="text-xs">{order.products?.description}</p>
                            </div>
                        ))
                    }
                </div>
                <div className="space-y-3 ">
                    <div>
                        <p>Customer Detail</p>
                    </div>
                    <div>
                        <p className="font-semibold">{orderHook?.order?.[0]?.user?.name}</p>
                        <p className="text-xs">{orderHook?.order?.[0]?.user?.email}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <ConfirmReleaseOrder
                    onConfirm={handleConfirm}
                    trigger={<Button
                        disabled={["Pending", "Completed"].includes(orderHook?.order?.[0]?.status) || orderHook.loading}
                    >Release Order</Button>}
                    orderNo={orderHook?.order?.[0]._id as string}
                />

            </div>
        </div>
    );
}

export default ReleaseOrderDetail;