import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

import { FC, ReactNode } from "react";

interface ConfirmPaymentProps {
    trigger: ReactNode;
    orderNo: string | null;
    orderHook: any;
}

const ConfirmPayment:FC<ConfirmPaymentProps> = ({trigger, orderNo, orderHook}) => {
    const session = useSession();
    const { toast } = useToast();
    const handleConfirmOrder = async () => {
        await orderHook?.confirmOrder({status: "Paid", cashier: session.data?.user?.session_id}, orderNo as string);
        toast({
            title: "Order Confirmed",
        })
        orderHook.setOrder(null)
    }
    return (
        <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Confirm Payment</DialogTitle>
                    <DialogDescription>
                        Please click proceed to confirm
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            onClick={handleConfirmOrder}
                            disabled={orderHook.loading}
                        >
                            Confirm
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
 
export default ConfirmPayment;