import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FC, ReactNode } from "react";

interface PlaceOrderConfirmationMessageProps {
    children: ReactNode;
    onConfirm: () => void;
    amount: string;
}
const PlaceOrderConfirmationMessage:FC<PlaceOrderConfirmationMessageProps> = ({children, onConfirm, amount}) => {

    return <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogDescription>
          Your total amount to pay at the counter {amount}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={onConfirm}>Submit</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
}

export default PlaceOrderConfirmationMessage;