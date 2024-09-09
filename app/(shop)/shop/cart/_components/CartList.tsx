"use client"

import useCart from "@/hooks/useCart";
import { CartProps } from "@/types/Cart";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import CartItem from "./CartItem";
import numeral from "numeral";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CartLists = () => {
    const router = useRouter();
    const session = useSession();
    const cartHook = useCart({init: !!session.data, q: session.data?.user?.id});
    const localStorageCart = JSON.parse(window.localStorage.getItem("cartItem") || "[]") as CartProps[];
    const cartList = useMemo(() => {
        if (!session.data?.user) {
            return localStorageCart || [];
        }
        return cartHook.cart?.carts || [];
    }, [session.data?.user]);
    const total = useMemo(() => {
        console.log("cartList", cartList,)
        if (cartList) {
            return (cartList || [])?.reduce((acc, val) => {
                return acc + val.price;
            }, 0)
        }
        return 0;
    }, [cartList]);

    const handleCheckout = () => {
        if (!session.data?.user) {
            router.push(`/auth/login?callbackUrl=/shop/cart`)
        }
    }
    return <div className="flex gap-5">
        <div className="border border-slate-500 rounded flex-1">
            {
                cartList?.map((cart, index) => (
                    <CartItem {...cart} key={index}/>
                ))
            }
            {
                !cartList.length && <p className="p-10 flex items-center justify-center text-sm">Cart is empty
                     <Link href="/shop" className="ml-2 text-blue-500 text-sm">Shop now</Link>
                </p>
            }
        </div>
        <div className="border border-slate-500 rounded p-5 w-1/4 space-y-8 flex flex-col">
            <div className="flex justify-between flex-1">
                <p className="text-xl font-semibold text-slate-600">Total</p>
                <p className="text-xl font-semibold text-slate-600">{numeral(total).format('0,0.00')}</p>
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