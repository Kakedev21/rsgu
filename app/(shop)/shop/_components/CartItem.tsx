"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useCart, { useCartState } from "@/hooks/useCart";
import { CartProps } from "@/types/Cart";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

const CartItem = () => {
    const session = useSession();
    const cartState = useCartState();
    const cartHook = useCart({init: !!session.data, q: session.data?.user?.id});
    const localStorageCart = JSON.parse(window.localStorage.getItem("cartItem") || "{}") as CartProps[];
    const cartCount = useMemo(() => {
        cartState.setUpdateCart(false);
        if (cartHook.cart?.cart.length) {
            return cartHook.cart.count || 0;
        }
       return localStorageCart.length;
    }, [cartHook.cart, cartState.updateCart]);
    const cartItems = useMemo(() => {
        cartState.setUpdateCart(false);
        if (cartHook.cart?.cart.length) {
            return cartHook.cart.cart || 0;
        }
       return localStorageCart;
    }, [cartHook.cart, cartState.updateCart]);
    useEffect(() => {
        if (session.data?.user && !cartHook.loading && localStorageCart.length) {
            (async () => {
                const parseLocalStoragePayload = localStorageCart?.map(item => ({
                    productId: item?.productId,
                    userId: session.data?.user?.id,
                    qty: item.qty || 1
                }))
                await cartHook.create(parseLocalStoragePayload);
                window.localStorage.clear();
            })()
        }
    }, [session.data?.user]);
    return <div className="border-b border-transparent group hover:border-white transition-all duration-300 p-3 relative">
        <DropdownMenu>
        <DropdownMenuTrigger>
            <ShoppingCart className="text-slate-50 cursor-pointer"/>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>My Cart</DropdownMenuLabel>
            <DropdownMenuSeparator />
           
        </DropdownMenuContent>
        </DropdownMenu>
   
    {!!cartCount && <div className="absolute rounded-full bg-slate-50 text-slate-600 w-5 h-5 top-[5px] right-[4px] text-xs flex justify-center items-center font-semibold">
        {cartCount}
    </div>}
  </div>
}


export default CartItem;