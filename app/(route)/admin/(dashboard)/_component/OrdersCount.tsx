"use client"

import useOrder from "@/hooks/useOrder";
import { FC, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

interface OrdersCountProps {
    status: string;
    className: string;
}

const OrdersCount: FC<OrdersCountProps> = ({ status, className }) => {
    const orderHook = useOrder({ init: false });
    const router = useRouter();

    useEffect(() => {
        if (orderHook.orderStatusCount === null) {
            orderHook.getOrderStatus(status);
        }
    }, [])

    const handleClick = () => {
        // Map the status to the corresponding tab value
        const tabValue = status.toLowerCase();
        router.push(`/admin/orders?tab=${tabValue}`);
    }

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer hover:opacity-80 transition"
        >
            <p className={twMerge("text-3xl", className)}>
                {orderHook.orderStatusCount}
            </p>
        </div>
    );
}

export default OrdersCount;