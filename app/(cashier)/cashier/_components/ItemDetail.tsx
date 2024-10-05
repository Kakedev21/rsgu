import { Skeleton } from "@/components/ui/skeleton";
import { OrderProps } from "@/types/Order";
import { times } from "lodash";
import numeral from "numeral";
import { FC } from "react";

interface ItemDetailProps {
    order: any;
    isPending: boolean;
}

const ItemDetail:FC<ItemDetailProps> = ({order, isPending}) => {
    if (isPending) {
        return <div className="space-y-3">
            {
                times(3).map(count => (<Skeleton className="w-full h-10" key={count}/>))
            }
            
        </div>
    }
    return (
        <div className="border border-slate-400 p-3 rounded flex flex-col gap-5 justify-between">
            <div className="flex w-full justify-between">
                <div>
                    <p>Item</p>
                </div>
                <div>
                    <p>Price</p>
                </div>
            </div>
            <div className="flex flex-col gap-y-2">
                {
                    order?.map((item: OrderProps) => (
                        <div key={item?._id} className="border border-slate-200 rounded p-2 flex justify-between items-center">
                            <div className="flex items-center gap-x-2">
                                <img src={item?.products?.image || "/no-image.png"} className="h-[60px] w-[80px]"/>
                                <div>
                                    <p>{item?.products?.name}</p>
                                    <p className="text-xs">{item?.products?.description}</p>
                                </div>
                            </div>
                            <div>
                                <p>₱{numeral(item?.products?.price).format("0,0.00")}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ItemDetail;