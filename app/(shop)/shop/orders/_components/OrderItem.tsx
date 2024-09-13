
import { OrderProps } from "@/types/Order";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import OrderProducts from "./OrderProducts";
import numeral from "numeral";
import moment from "moment";
import Barcode from "react-barcode";
import { ScanLine } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const OrderItem: FC<OrderProps> = ({_id, status, totalAmount, productId, createdAt}) => {

    const statusColor: any = {
        Completed: 'text-green-500',
        Pending: 'text-amber-500'
    }

    return <div className="border border-slate-50 bg-white p-5 rounded shadow">
        <div className="flex justify-between items-center">
            <div>
                <div className="flex gap-2 items-center">
                    <Popover>
                        <PopoverTrigger><ScanLine /></PopoverTrigger>
                        <PopoverContent
                            className="w-full"
                        >
                            <Barcode value={_id?.slice(-8) as string}/>
                        </PopoverContent>
                    </Popover>
                    <p className="text-sm">Order Number:</p>
                    <p className="font-semibold text-sm">
                        {_id?.slice(-8) as string}
                    </p>
                </div>
                <p className="text-xs text-slate-600">{moment(createdAt).format("lll")}</p>
                <p className={twMerge("text-xs text-slate-600", statusColor?.[status])}>{status}</p>
            </div>
            <div>
             <p className="font-bold text-slate-700">₱{numeral(totalAmount).format('0,0.00')}</p>
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