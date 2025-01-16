"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useOrder from "@/hooks/useOrder";
import { FC, useEffect, useCallback, useState } from "react";
import ConfirmReleaseOrder from "./ConfirmReleaseOrder";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import useReport from "@/hooks/useReport";
import emailjs from '@emailjs/browser';
import { report } from "process";

interface ReleaseOrderDetailProps {
    orderNo: string;
}

const ReleaseOrderDetail: FC<ReleaseOrderDetailProps> = ({ orderNo }) => {
    const orderHook = useOrder({ init: false });
    const reportHook = useReport()
    const session = useSession();
    const { toast } = useToast();
    const [isLimitReached, setIsLimitReached] = useState(false);


    const checkReleaseLimit = async () => {
        try {
            const response = await fetch('/api/bff/limit');
            const data = await response.json();
            if (data[0]) {
                const completedOrders = await orderHook.getCompletedOrders();
                const todayOrders = completedOrders.filter((order: any) => {
                    const orderDate = new Date(order.createdAt!).toDateString();
                    const today = new Date().toDateString();
                    return orderDate === today;
                });
                setIsLimitReached(todayOrders.length >= data[0].release);
            }
        } catch (error) {
            console.error("Error checking release limit:", error);
        }
    };

    const handleConfirm = async () => {
        await checkReleaseLimit();

        if (isLimitReached) {
            toast({
                title: "Release limit reached for today",
                variant: "destructive"
            });
            return;
        }

        const orderResponse = await orderHook.confirmOrder({ status: "Completed", admin: session?.data?.user?.session_id as string }, orderHook?.order?.[0]?._id as string);

        console.log("orderresponse", orderResponse.order)

        if (orderResponse.order) {
            console.log("Updating sales quantities")
            await Promise.all(orderResponse.order.order.productAndQty.map(async (item: any) => {
                await reportHook.updateSales({
                    productId: item.productId,
                    salesQuantity: item.quantity,
                    date: new Date()
                })
            }))

            // Send threshold notification email if product quantity is low
            if (orderResponse.order.updatedProducts) {
                await Promise.all(orderResponse.order.updatedProducts.map(async (product: any) => {
                    if (product.quantity <= product.limit) {
                        await emailjs.send('service_7qol6gv', 'template_bmg2z7v', {
                            product_name: product.name,
                            threshold_quantity: product.limit,
                            current_stock: product.quantity
                        }, {
                            publicKey: 'DL0gCccNkjcEvSL01'
                        });
                    }
                }));
            }

            // Send email notification
            await emailjs.send('service_7qol6gv', 'template_zimysjt', {
                order_no: orderHook?.order?.[0]._id?.slice(-6),
                user_name: orderHook?.order?.[0]?.user?.name,
                user_email: orderHook?.order?.[0]?.user?.email
            }, {
                publicKey: 'DL0gCccNkjcEvSL01'
            });
        }

        await orderHook.orderDetail(orderNo as string)
        toast({
            title: "Order Completed"
        })
    }

    const handleBarcodeScanner = useCallback(async (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            const scannedOrderNo = (event.target as HTMLInputElement).value;
            if (scannedOrderNo === orderHook?.order?.[0]?._id && orderHook?.order?.[0]?.status === "Paid") {
                await handleConfirm();
            }
            // Clear any input field that might have captured the barcode
            (event.target as HTMLInputElement).value = '';
        }
    }, [orderHook?.order, orderNo]);

    useEffect(() => {
        // Add event listener for barcode scanner
        window.addEventListener('keydown', handleBarcodeScanner);
        checkReleaseLimit();

        return () => {
            window.removeEventListener('keydown', handleBarcodeScanner);
        };
    }, [handleBarcodeScanner]);

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

    console.log(orderHook.order)
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
                        disabled={["Pending", "Completed"].includes(orderHook?.order?.[0]?.status) || orderHook.loading || isLimitReached}
                    >{isLimitReached ? "Released Limit Reached" : "Release Order"}</Button>}
                    orderNo={orderHook?.order?.[0]._id as string}
                />
            </div>
        </div>
    );
}

export default ReleaseOrderDetail;