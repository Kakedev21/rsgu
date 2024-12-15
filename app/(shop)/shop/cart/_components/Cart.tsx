"use client";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { CartProps } from "@/types/Cart";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import numeral from "numeral";
import { FC } from "react";
import DeleteConfirmationMessage from "./DeleteConfirmationMessage";

const Cart: FC<CartProps> = ({ name, description, price, _id, qty, pickedSize }) => {
    const cartHook = useCart({ init: false });
    const session = useSession();
    const handleDeleteCart = async () => {
        if (!session.data?.user?.session_id) {
            const cartItem = JSON.parse(window.localStorage.getItem("cartItem") || "[]");
            if (cartItem.length) {
                const filterCartItem = cartItem?.filter((item: CartProps) => item?.productId !== _id);
                window.localStorage.setItem("cartItem", JSON.stringify(filterCartItem));
            }
        } else {
            await cartHook.deleteCart(_id as string);
            window.location.reload();
        }

    }

    const handleAddCart = async () => {
        if (!session.data?.user?.session_id) {
            const cartItem = JSON.parse(window.localStorage.getItem("cartItem") || "[]");
            const payload = {
                productId: _id,
                name,
                description,
                price
            }
            window.localStorage.setItem("cartItem", JSON.stringify([...cartItem, payload]));
        } else {
            if (!_id) {
                return
            }
            const payload = {
                productId: _id,
                userId: session.data?.user?.session_id,
                name,
                description,
                price,
                qty: 1,
            }
            await cartHook.create([payload]);
            window.location.reload();
        }
    }

    const handleQuantity = async (action: 'add' | 'remove') => {
        if (!session.data?.user?.session_id) {
            const cartItem = JSON.parse(window.localStorage.getItem("cartItem") || "[]");
            if (action === 'add') {
                const payload = {
                    productId: _id,
                    name,
                    description,
                    price
                }
                window.localStorage.setItem("cartItem", JSON.stringify([...cartItem, payload]));
            } else {
                const filterCartItem = cartItem?.filter((item: CartProps) => item?.productId !== _id);
                window.localStorage.setItem("cartItem", JSON.stringify(filterCartItem));
            }
        } else {
            if (!_id) return;
            await cartHook.changeCartQuantity(_id, action);
            window.location.reload();
        }
    }

    return <div className="flex items-center gap-5 justify-between p-5 border-b border-slate-300">
        <div>
            <p className="font-semibold text-slate-700">{name}</p>
            <p className="font-semibold text-xs text-slate-500">{description}</p>
            <p className="font-semibold text-xs text-slate-500">Size: {pickedSize}</p>
        </div>
        <div className="space-y-1">
            <p className="font-semibold">₱{numeral(price).format('0,0.00')}</p>
            <div className="flex items-center gap-2">
                <Button onClick={() => handleQuantity('remove')} variant="ghost" size="sm">-</Button>
                {qty}
                <Button onClick={() => handleQuantity('add')} variant="ghost" size="sm">+</Button>
                <DeleteConfirmationMessage
                    onConfirm={handleDeleteCart}
                >
                    <Button variant="ghost" size="sm">
                        <Trash2 className="text-red-500" size={14} />
                    </Button>
                </DeleteConfirmationMessage>
            </div>
        </div>
    </div>
}


export default Cart;