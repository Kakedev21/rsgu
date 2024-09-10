"use client";

import useCart, { useCartState } from "@/hooks/useCart";
import { CartProps } from "@/types/Cart";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const CartItem = () => {
    const router = useRouter();
    const session = useSession();
    const cartState = useCartState();
    const cartHook = useCart({init: !!session.data, q: session.data?.user?.id});
    const localStorageCart = JSON.parse(window.localStorage.getItem("cartItem") || "{}") as CartProps[];
    const cartCount = useMemo(() => {
        cartState.setUpdateCart(false);
        if (cartHook.cart?.carts?.length && !cartHook.loading) {
            
            return cartHook.cart.count || 0;
        }
       return localStorageCart.length;
    }, [cartHook.cart, cartState.updateCart]);
   
    useEffect(() => {
        if (session.data?.user?.session_id && !cartHook.loading && localStorageCart.length) {
            
            (async () => {
                console.log("session.data?.user?.id", session.data?.user?.id)
                const parseLocalStoragePayload = localStorageCart?.map(item => ({
                    productId: item?.productId,
                    name: item?.name,
                    description: item?.description,
                    price: item?.price,
                    userId: session.data?.user?.session_id,
                    qty: item.qty || 1
                }))
                const result = await cartHook.create(parseLocalStoragePayload);
                if (!result.data?.error) {
                    window.localStorage.clear();
                }
            })()
        }
    }, [session.data?.user?.session_id]);
    return <div className="border-b border-transparent group hover:border-white transition-all duration-300 p-3 relative">
        <ShoppingCart className="text-slate-50 cursor-pointer" onClick={() => {
            if (cartCount) {
                router.push("/shop/cart")
            }
        }}/>
    {!!cartCount && <div className="absolute rounded-full bg-slate-50 text-slate-600 w-5 h-5 top-[5px] right-[4px] text-xs flex justify-center items-center font-semibold">
        {cartCount}
    </div>}
  </div>
}


export default CartItem;