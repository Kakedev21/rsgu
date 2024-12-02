"use client";

import SearchInput from "@/components/SearchInput";
import ItemDetail from "./ItemDetail";
import TotalPayment from "./TotalPayment";
import PaymentCTA from "./PaymentCTA";
import useDebounce from "@/hooks/useDebounce";
import { useEffect } from "react";
import useOrder from "@/hooks/useOrder";
import Slip from "./Slip";
import OrderList from "./OrderList";

const Cashier = () => {
    const debounce = useDebounce();
    const orderHook = useOrder({});
    useEffect(() => {
        if (debounce.debounceValue) {
            orderHook.orderDetail(debounce.debounceValue as string)
        }
    }, [debounce.debounceValue]);
    console.log("order", orderHook.order,)
    return (
        <div className="w-full bg-white p-5 rounded-lg shadow-md space-y-5">
            <div className="flex justify-between items-center gap-5">
                <div className=" w-2/3">
                    <p className="font-semibold">Cashier</p>
                </div>
                <div>

                </div>
                <SearchInput placeholder="Order no." autoFocus data-autofocus onChange={({ target }) => debounce.setValue(target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">

                <div className="space-y-5">
                    {/* <ItemDetail order={orderHook.order as any} isPending={orderHook.loading} /> */}
                    <Slip orderData={orderHook.order as any} />

                </div>
                <div className="space-y-5">
                    <TotalPayment total={orderHook.order?.[0]?.totalAmount || ""} status={orderHook.order?.[0]?.status as string} />
                </div>
            </div>
            <div className="flex justify-end">
                <PaymentCTA orderNo={orderHook.order?.[0]._id as string} status={orderHook.order?.[0]?.status as string} orderHook={orderHook} />
            </div>

            <OrderList />
        </div>
    )
}


export default Cashier;