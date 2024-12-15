"use client";

import { Button } from "@/components/ui/button";
import useCart, { useCartState } from "@/hooks/useCart";
import { ProductProps } from "@/types/Product";
import { isEmpty } from "lodash";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import numeral from "numeral";
import { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import useCategory from "@/hooks/useCategory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductItem: FC<ProductProps> = (props) => {
    const { name, description, price, _id, image, quantity, status, category, availableSizes } = props;
    const cartState = useCartState();
    const categoryHook = useCategory({ init: false })
    const cartHook = useCart({ init: false });
    const session = useSession();
    const router = useRouter();
    const [categoryName, setCategoryName] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");

    const handleAddToCartClick = async () => {
        if (categoryName === "Uniforms" && !selectedSize) {
            alert("Please select a size first");
            return;
        }

        console.log("session.data?.user?.id", session.data?.user)
        const payload = [
            {
                name: name as string,
                price: price as number,
                description: description as string,
                productId: _id as string,
                userId: session.data?.user?.session_id as string,
                qty: 1,
                pickedSize: selectedSize
            }
        ]
        if (session.data?.user) {
            await cartHook.create(payload);
            window.location.reload();
        } else {
            const localStorageCart = JSON.parse(window.localStorage.getItem("cartItem") || "{}");
            let updatedPayload = payload;
            if (!isEmpty(localStorageCart)) {
                updatedPayload = [...updatedPayload, ...localStorageCart];
            }
            window.localStorage.setItem("cartItem", JSON.stringify(updatedPayload));
            cartState.setUpdateCart(true);
        }
    }

    const handleBuyNow = async () => {
        if (categoryName === "Uniforms") {
            if (!selectedSize) {
                alert("Please select a size first");
                return;
            }
        }

        const payload = [
            {
                name: name as string,
                price: price as number,
                description: description as string,
                productId: _id as string,
                userId: session.data?.user?.session_id as string,
                qty: 1,
                pickedSize: categoryName === "Uniforms" ? selectedSize : undefined
            }
        ]
        if (session.data?.user) {
            await cartHook.create(payload);
            router.push("/shop/cart")
        } else {
            window.location.href = `/auth/login?callbackUrl=${window.location.origin}/shop/cart`
        }
    }

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const result = await categoryHook.getCategory(category);
                if (result?.category?.name) {
                    setCategoryName(result.category.name);
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        }
        if (category) {
            fetchCategory();
        }
    }, [category]);

    return <div className="space-y-2 border border-slate-50 shadow rounded-md p-3 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col">
            <img src={image || "/no-image.png"} className="h-[150px] w-full object-cover rounded" />
            <div className="mt-3 min-h-[80px]">
                <p className="font-semibold text-base sm:text-lg text-slate-700 line-clamp-1">{name}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{description}</p>
            </div>
            <div className="space-y-1">
                <span className="font-semibold text-base sm:text-lg text-slate-600 block">₱{numeral(price).format('0,0.00')}</span>
                <span className="text-xs text-slate-600 block">Stocks: {quantity}</span>
                <span className={twMerge("text-xs", (status || "Available") === "Available" ? "text-green-500" : "text-red-500")}>{status || "Available"}</span>
            </div>

            {categoryName === "Uniforms" && availableSizes && (
                <div className="mt-3">
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSizes.map((sizeOption) => (
                                <SelectItem key={sizeOption.size} value={sizeOption.size}>
                                    {sizeOption.size} - {sizeOption.yards} yards
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
        <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline"
                onClick={handleAddToCartClick}
                size="sm"
                disabled={(status || "Available") === "Not Available"}
                className="px-3"
            >
                <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
                onClick={handleBuyNow}
                size="sm"
                disabled={(status || "Available") === "Not Available"}
                className="text-sm whitespace-nowrap"
            >
                Buy now
            </Button>
        </div>
    </div>

}


export default ProductItem;