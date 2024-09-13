"use client";

import useOrder from "@/hooks/useOrder";
import { useSession } from "next-auth/react";
import { FC, useEffect, useMemo } from "react";
import OrderItem from "./OrderItem";
import { OrderProps } from "@/types/Order";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";

interface OrderListProps {
    user_id: string;
}

const OrdersList: FC<OrderListProps> = ({user_id}) => {
    const debounceHook = useDebounce();
    const orderHook = useOrder({init: false, user_id});
   
    const orders = useMemo(() => {
        return orderHook.orders?.orders || [];
    }, [orderHook.orders?.orders]);
    useEffect(() => {
        orderHook.getAllOrder({page: 1, limit: 20, user_id, q: debounceHook.debounceValue})
    }, [debounceHook.debounceValue])
    console.log("user_id", user_id, orders, orderHook)
    return <div className="space-y-5">
        <div className=" bg-white flex justify-center items-center mx-auto sm:w-1/2 w-full">
            <SearchInput placeholder="Search Order Number..."
                onChange={({target}) => debounceHook.setValue(target.value)}
            />
        </div>
        {
            !orderHook.loading && orders?.map((order: OrderProps) => (
                <OrderItem {...order} key={order?._id}/>
            ))
        }

    </div>
}


export default OrdersList;