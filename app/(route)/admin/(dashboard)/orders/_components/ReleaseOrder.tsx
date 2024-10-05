"use client"

import { FC, ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import useOrder from "@/hooks/useOrder";
import ReleaseOrderDetail from "./ReleaseOrderDetail";
interface ReleaseOrderProps {
    trigger: ReactNode
}
const ReleaseOrder:FC<ReleaseOrderProps> = ({trigger}) => {
    const debounceHook = useDebounce();
    
    return (
        <Dialog>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent className="min-w-[70vw]">
            <DialogHeader>
            <DialogTitle>Release Order</DialogTitle>
            <DialogDescription>
                Please input the Order No
            </DialogDescription>
            </DialogHeader>
            <div className="container space-y-5">
                <SearchInput autoFocus placeholder="Order no..." onChange={({target}) => debounceHook.setValue(target.value)}/>
                <div>
                    <ReleaseOrderDetail orderNo={debounceHook.debounceValue as string}/>
                </div>
            </div>
        </DialogContent>
        </Dialog>

    );
}
 
export default ReleaseOrder;