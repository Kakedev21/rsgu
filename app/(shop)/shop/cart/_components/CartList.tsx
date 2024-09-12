"use client"

import useCart from "@/hooks/useCart";
import { CartProps } from "@/types/Cart";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import numeral from "numeral";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { times } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";
import PlaceOrderConfirmationMessage from "./PlaceOrderConfirmationMessage";
import useOrder from "@/hooks/useOrder";
import { useToast } from "@/components/ui/use-toast";
import Barcode from 'react-barcode';
import Cart from "./Cart";
const CartLists = () => {
    const router = useRouter();
    const session = useSession();
    const cartHook = useCart({init: !!session.data?.user?.session_id, q: session.data?.user?.session_id});
    const orderHook = useOrder({init: false});
    const {toast} = useToast();
    const localStorageCart = JSON.parse(window.localStorage.getItem("cartItem") || "[]") as CartProps[];
    const cartList = useMemo(() => {
        if (!session.data?.user) {
            return localStorageCart || [];
        }
        return cartHook.cart?.carts || [];
    }, [cartHook.cart?.carts]);
    const total = useMemo(() => {
        if (cartList) {
            return (cartList || [])?.reduce((acc, val) => {
                return acc + val.price;
            }, 0)
        }
        return 0;
    }, [cartList]);

    useEffect(() => {
        if (!cartHook.loading && !cartHook.cart?.count) {
            cartHook.getAllCart(1, 10)
        }
    }, [session.data?.user?.session_id])


    const handlePlaceOrder = async () => {
        const payload = {
            productId: cartList?.map(cart => cart?.productId),
            userId: session.data?.user?.session_id as string,
            status: "Pending",
            totalAmount: cartList?.reduce((acc, val) => {
                return acc + val?.price
            }, 0)
        }

        const result = await orderHook.create([payload]);
        if (result?.order) {
            await cartHook.clearCart(session.data?.user?.session_id as string);
            const orderNumber = result?.order?.[0]?.["_id"]?.slice(-8);
            toast({
                title: `Order Number ${orderNumber}`,
                description: <div>
                    <p>You have successfully created an order</p>
                    <Barcode value={orderNumber}/>  
                </div>,
                duration: 10000
            });
        } else {
            toast({
                title: `Place order failed`,
                description: "Please try again later"
            });
        }

    }
   const loading = useMemo(() => {
    return cartHook.loading || orderHook.loading;
   }, [cartHook.loading, orderHook.loading])
    return <div className="flex-col gap-5 space-y-5 sm:flex sm:space-y-0">
        <div className="border border-slate-500 rounded sm:flex-1">
            {
                loading && times(3).map(count => (
                    <div key={count} className="flex justify-between gap-3 space-y-3 my-2 mx-5">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-[300px]"/>
                            <Skeleton className="h-5 w-1/2"/>
                        </div>
                        <div className="space-y-2 hidden sm:block">
                            <Skeleton className="h-5 w-[60px]"/>
                            <Skeleton className="h-5 w-[30px]"/>
                        </div>
                    </div>
                ))
            }
            {
                !loading && cartList?.map((cart, index) => (
                    <Cart {...cart} key={index}/>
                ))
            }
            {
                !cartList.length && !loading && <p className="p-10 flex items-center justify-center text-sm">Cart is empty
                     <Link href="/shop" className="ml-2 text-blue-500 text-sm">Shop now</Link>
                </p>
            }
        </div>
        <div className="border border-slate-500 rounded p-5 sm:w-full md:w-1/4 space-y-8 ml-auto">
            <div className="flex justify-between flex-1">
                <p className="text-xl font-semibold text-slate-600">Total</p>
                <p className="text-xl font-semibold text-slate-600">₱{numeral(total).format('0,0.00')}</p>
            </div>
            <div className="flex justify-end items-end">
                <PlaceOrderConfirmationMessage
                    amount={`₱${numeral(total).format('0,0.00')}`}
                    onConfirm={handlePlaceOrder}
                >
                <Button className="flex gap-3 items-center" 
                    disabled={!cartList.length || loading}>
                    Place Order
                    <ArrowRight />
                </Button>
                </PlaceOrderConfirmationMessage>
            </div>
        </div>
    </div>

} 


export default CartLists;