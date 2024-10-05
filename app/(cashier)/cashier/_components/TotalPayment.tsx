import numeral from "numeral";
import { FC } from "react";

interface TotalPaymentProps {
    status: string;
    total: string | number;
}

const TotalPayment:FC<TotalPaymentProps> = ({status, total}) => {
    
    return <div className="space-y-5">
        <div className="flex justify-between">
            <div className="font-semibold">Status</div>
            <div className="font-semibold text-lg text-blue-500">{status}</div>
        </div>
        <div className="flex justify-between">
            <div className="font-semibold">Total</div>
            <div className="font-semibold text-lg">₱{numeral(total).format("0,0.00")}</div>
        </div>
    </div>

}


export default TotalPayment;