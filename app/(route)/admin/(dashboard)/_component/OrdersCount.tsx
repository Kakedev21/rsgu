"use client"

import useOrder from "@/hooks/useOrder";
import { FC, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface OrdersCountProps {
    status: string;
    className: string;
}
const OrdersCount: FC<OrdersCountProps> = ({status, className}) => {
    const orderHook = useOrder({init: false});

    useEffect(() => {
        if (orderHook.orderStatusCount === null) {
            orderHook.getOrderStatus(status);
        }
    }, [])

    
    return (
        <div>
            <p className={twMerge("text-3xl", className)}>{orderHook.orderStatusCount}</p>
        </div>
    );
}
 
export default OrdersCount;