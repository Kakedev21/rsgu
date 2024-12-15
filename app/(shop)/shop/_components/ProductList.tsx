"use client"

import { Skeleton } from "@/components/ui/skeleton";
import useProduct from "@/hooks/useProduct";
import { times } from "lodash";
import ProductItem from "./ProductItem";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import useCategory from "@/hooks/useCategory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { twMerge } from "tailwind-merge";

const ProductList = ({ searchValue }: { searchValue: string }) => {

    const searchParams = useSearchParams();
    const productHook = useProduct({ init: false });
    const pageOffset = Number(searchParams.get("page")) || 1;
    const categoryHook = useCategory({ init: true, limit: 100 });
    const [category, setCategory] = useState<string>("");
    useEffect(() => {
        if (!productHook.loading) {
            (async () => {
                await productHook.getAll(pageOffset, 10, searchValue);
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
    const handleFilter = (category_id: string) => {
        productHook.getAll(pageOffset, 100, null, category_id);
        setCategory(category_id);
    }

    return <div className="space-y-5 overflow-y-scroll">
        <div className="w-full overflow-x-scroll py-5">
            <div className="flex gap-3 items-center w-max">
                {
                    categoryHook.categories?.categories?.map((cat) => {
                        const _id = cat?._id as string
                        return <Button variant={category === _id ? "default" : "outline"} key={cat._id} className={"rounded-full"} onClick={() => handleFilter(cat._id as string)} disabled={productHook.loading}>{cat.name}</Button>
                    })
                }
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 overflow-y-scroll pb-5">
            {
                productHook.products?.products.map(product => (<ProductItem {...product} key={product?._id} />))
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
                            <RefreshCcw size={18} />
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