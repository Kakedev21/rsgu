"use client"

import { Skeleton } from "@/components/ui/skeleton";
import useProduct from "@/hooks/useProduct";
import { times } from "lodash";
import ProductItem from "./ProductItem";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

const ProductList = ({searchValue}: {searchValue: string}) => {
   
    const searchParams = useSearchParams();
    const productHook = useProduct({init: false});
    const pageOffset =  Number(searchParams.get("page")) || 1;
    useEffect(() => {
        if (!productHook.loading) {
           (async () => {
            await  productHook.getAll(pageOffset, 10, searchValue);
           })()
        }
    }, [searchValue])
    if (productHook.loading) {
        return <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {
                times(4).map(count => {
                    return <div key={count} className="space-y-2">
                        <Skeleton className="w-full h-[200px]" />
                        <Skeleton className="w-1/2 h-[20px]" />
                        <Skeleton className="w-full h-[20px]" />
                        <div className="flex justify-between gap-5">
                            <Skeleton className="w-full h-[30px]" />
                            <Skeleton className="w-full h-[30px]" />
                        </div>
                    </div>
                })
            }
        </div>
    }
    
   
    return <div className="space-y-10 overflow-y-scroll">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 overflow-y-scroll py-5">
            {
                productHook.products?.products.map(product => (<ProductItem {...product} key={product?._id}/>))
            }
            {
                !productHook.products?.products.length && <div className="mx-auto col-span-4 my-5">
                    <p>No Products to display</p>
                    <div className="flex gap-3 items-center">
                        
                        <Button variant="ghost" 
                            className="flex gap-3 items-center"
                            onClick={async () => {
                                await productHook.getAll(pageOffset, 10)
                            }}
                        >
                            <RefreshCcw size={18}/>
                            Refresh
                        </Button>
                    </div>
                </div>
            }
        </div>
        <div className="flex gap-5 justify-center">
            <Button variant="outline" disabled={!productHook.products?.page || (productHook.products?.page as number) <= 1}>
                Prev
            </Button>
            <Button variant="outline"
                disabled={!productHook.products?.count || pageOffset >= Math.ceil((productHook.products?.count as number) / (productHook.products?.limit as number))}
            >
                Next
            </Button>
        </div>
    </div>

}


export default ProductList;