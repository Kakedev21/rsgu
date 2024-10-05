"use client";

import { Button } from "@/components/ui/button";
import useCart, { useCartState } from "@/hooks/useCart";
import { ProductProps } from "@/types/Product";
import { isEmpty } from "lodash";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import numeral from "numeral";
import { FC } from "react";


const ProductItem:FC<ProductProps>  = (props) => {
    const {name, description, price, _id, image} = props;
    const cartState = useCartState();
    const cartHook = useCart({init:false});
    const session = useSession();
    const router = useRouter();
    const handleAddToCartClick = async () => {
        console.log("session.data?.user?.id", session.data?.user)
        const payload = [
            {
                name: name as string,
                price: price as number,
                description: description as string,
                productId: _id as string,
                userId: session.data?.user?.session_id as string,
                qty: 1
            }
        ]
        if (session.data?.user) {
            await cartHook.create(payload);
            window.location.reload();
        } else {
            const localStorageCart = JSON.parse(window.localStorage.getItem("cartItem") || "{}");
            let updatedPayload = payload;
            if (!isEmpty(localStorageCart)) {
                updatedPayload = [...updatedPayload,   ...localStorageCart];
            }
            window.localStorage.setItem("cartItem", JSON.stringify(updatedPayload));
            cartState.setUpdateCart(true);
        }
    }

    const handleBuyNow = async () => {
        const payload = [
            {
                name: name as string,
                price: price as number,
                description: description as string,
                productId: _id as string,
                userId: session.data?.user?.session_id as string,
                qty: 1
            }
        ]
        if (session.data?.user) {
            await cartHook.create(payload);
            router.push("/shop/cart")
        } else {
            window.location.href = `/auth/login?callbackUrl=${window.location.origin}/shop/cart`
        }
    }
    return <div className="space-y-2 border border-slate-50 shadow rounded-md p-3 hover:shadow-lg transition-all duration-300">
        <div className=" min-h-20">
            <img src={image || "/no-image.png"} className="h-[60px] w-full rounded"/>
            <div className="h-16">
                <p className="font-semibold text-lg text-slate-700">{name}</p>
                <p className="text-sm text-slate-600">{description}</p>
            </div>
            <span className="font-semibold text-slate-600">₱{numeral(price).format('0,0.00')}</span>
        </div>
        <div className="flex justify-end gap-3">
            <Button variant="outline"
                onClick={handleAddToCartClick}
                size="sm"
            >
                <ShoppingCart size={16}/>
            </Button>
            <Button
                onClick={handleBuyNow}
                size="sm"
                className="text-xs sm:text-base"
            >
                Buy now
            </Button>
        </div>
    </div>

}


export default ProductItem;