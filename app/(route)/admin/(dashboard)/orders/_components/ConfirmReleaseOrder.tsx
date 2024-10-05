"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";
import { FC, ReactNode } from "react";
  
interface ConfirmReleaseOrderProps {
    trigger: ReactNode;
    orderNo: string;
    onConfirm: () => void;
}
const ConfirmReleaseOrder:FC<ConfirmReleaseOrderProps> = ({trigger, orderNo, onConfirm}) => {
    return (
        <Dialog>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Confirm Release Order {orderNo.slice(-8)}?</DialogTitle>
            <DialogDescription>
                
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button onClick={onConfirm}>Confirm</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
        </Dialog>

    );
}
 
export default ConfirmReleaseOrder;