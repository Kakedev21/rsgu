import { Button } from "@/components/ui/button";

import { FC } from "react";
import ConfirmPayment from "./ConfirmPayment";

interface PaymentCTAProps {
    orderNo: string | null;
    status: string | null;
    orderHook: any
}
const PaymentCTA: FC<PaymentCTAProps> = ({orderNo = null, status, orderHook}) => {


    return <div className="flex gap-5 items-center">
        <ConfirmPayment
            orderHook={orderHook}
            orderNo={orderNo}
            trigger={<Button
                disabled={orderNo === null || status === "Paid" || orderHook.loading}
                className="w-full"
            >
                Paid
            </Button>}
        />
        
       
    </div>
}


export default PaymentCTA;