import { Button } from "@/components/ui/button";

const PaymentCTA = () => {


    return <div className="flex gap-5 items-center">
        <Button
            disabled
        >
            Paid
        </Button>
        <Button
            disabled
        >
            Send
        </Button>
    </div>
}


export default PaymentCTA;