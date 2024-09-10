"use client"

import useCart from "@/hooks/useCart";
import { CartProps } from "@/types/Cart";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import CartItem from "./CartItem";
import numeral from "numeral";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { times } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";

const CartLists = () => {
    const router = useRouter();
    const session = useSession();
    const cartHook = useCart({init: !!session.data?.user?.session_id, q: session.data?.user?.session_id});
    const localStorageCart = JSON.parse(window.localStorage.getItem("cartItem") || "[]") as CartProps[];
    const cartList = useMemo(() => {
        if (!session.data?.user) {
            return localStorageCart || [];
        }
        return cartHook.cart?.carts || [];
    }, [cartHook.cart?.carts]);
    const total = useMemo(() => {
        console.log("cartList", cartList,)
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
    const handleCheckout = () => {
        if (!session.data?.user) {
            router.push(`/auth/login?callbackUrl=/shop/cart`)
        }
    }
   
    return <div className="flex gap-5">
        <div className="border border-slate-500 rounded flex-1">
            {
                cartHook.loading && times(3).map(count => (
                    <div key={count} className="flex justify-between gap-3 space-y-3 my-2 mx-5">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-[300px]"/>
                            <Skeleton className="h-5 w-1/2"/>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-[60px]"/>
                            <Skeleton className="h-5 w-[30px]"/>
                        </div>
                    </div>
                ))
            }
            {
                !cartHook.loading && cartList?.map((cart, index) => (
                    <CartItem {...cart} key={index}/>
                ))
            }
            {
                !cartList.length && !cartHook.loading && <p className="p-10 flex items-center justify-center text-sm">Cart is empty
                     <Link href="/shop" className="ml-2 text-blue-500 text-sm">Shop now</Link>
                </p>
            }
        </div>
        <div className="border border-slate-500 rounded p-5 w-1/4 space-y-8 flex flex-col">
            <div className="flex justify-between flex-1">
                <p className="text-xl font-semibold text-slate-600">Total</p>
                <p className="text-xl font-semibold text-slate-600">₱{numeral(total).format('0,0.00')}</p>
            </div>
            <div className="flex justify-end items-end">
                <Button className="flex gap-3 items-center" 
                disabled={!cartList.length}
                onClick={handleCheckout}>
                    Checkout
                    <ArrowRight />
                </Button>
            </div>
        </div>
    </div>

} 


export default CartLists;