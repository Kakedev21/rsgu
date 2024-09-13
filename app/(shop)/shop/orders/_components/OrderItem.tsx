
import { OrderProps } from "@/types/Order";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import OrderProducts from "./OrderProducts";
import numeral from "numeral";
import moment from "moment";

const OrderItem: FC<OrderProps> = ({_id, status, totalAmount, productId, createdAt}) => {

    const statusColor: any = {
        Completed: 'text-green-500',
        Pending: 'text-amber-500'
    }

    return <div className="border border-slate-50 bg-white p-5 rounded shadow">
        <div className="flex justify-between">
            <div>
                <div className="flex gap-2 items-center">
                    <p className="text-sm">Order Number:</p>
                    <p className="font-semibold text-sm">{_id?.slice(-8)}</p>
                </div>
                <p className="text-xs text-slate-600">{moment(createdAt).format("lll")}</p>
                <p className={twMerge("text-xs text-slate-600", statusColor?.[status])}>{status}</p>
            </div>
            <div>
                <div>
                    <p className="font-bold text-slate-700">₱{numeral(totalAmount).format('0,0.00')}</p>
                </div>
            </div>
        </div>
        <div className="space-y-2 mt-1">
            {
                productId?.map((product, index) => (
                    <OrderProducts key={`${product?._id}_${index}`} {...product}/>
                ))
            }
        </div>
    </div>
}


export default OrderItem;