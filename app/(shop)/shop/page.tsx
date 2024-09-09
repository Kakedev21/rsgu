"use client";

import { ShoppingBasket } from "lucide-react";
import ProductList from "./_components/ProductList";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";

const ShopPage = () => {
    const debounceHook = useDebounce();

    return <div className="bg-white w-full p-5 rounded-lg shadow space-y-5">
        <div className="flex gap-x-2 items-center">
            <ShoppingBasket className="text-slate-700"/>
            <p className="font-semibold text-xl  text-slate-700">Shop</p>
        </div>
        <div className=" bg-white flex justify-center items-center mx-auto w-1/2">
            <SearchInput placeholder="Search Product..."
                onChange={({target}) => debounceHook.setValue(target.value)}
            />
        </div>
        <ProductList searchValue={debounceHook.debounceValue as string}/>
    </div>
}


export default ShopPage;