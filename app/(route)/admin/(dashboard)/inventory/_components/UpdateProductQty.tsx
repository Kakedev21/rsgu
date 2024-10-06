"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UseProductStateProps } from "@/hooks/useProduct";
import { FC, useRef } from "react";

interface UpdateProductQtyProps {
    open: boolean;
    onOpenChange: (val: boolean) => void;
    productState: UseProductStateProps;
    productHook: any;
    handleRefresh: any;
}

const UpdateProductQty: FC<UpdateProductQtyProps> = ({open, onOpenChange, productState, productHook, handleRefresh}) => {
    const qtyRef = useRef<any>();
    const { toast } = useToast()
    const handleUpdateQty = async () => {
        await productHook?.update({
            quantity: Number(qtyRef?.current?.value)
        }, productState.selected?._id);
        handleRefresh();
        productState.setSelected(null);
        productState.setOpenFormDialog(false);
        toast({
            title: "Quantity updated"
        })

    }
    return (
        <Dialog
        open={open}
        onOpenChange={(val) => {
            if (!val) {
                productState.setSelected(null)
            }
            onOpenChange(val);
        }}
        >
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{productState?.selected?.productId} {productState.selected?.name} {productState.selected?.description}</DialogTitle>
            <DialogDescription>
                Update Quantity
            </DialogDescription>
            <div className="pt-5">
                <Label>Quantity</Label>
                <Input type="number" defaultValue={productState.selected?.quantity} ref={qtyRef}  disabled={productHook.loading}/>
            </div>
            </DialogHeader>
            <DialogFooter>
                <Button variant="ghost" 
                    disabled={productHook.loading}
                    onClick={() => {
                    productState.setSelected(null);
                    productState.setOpenFormDialog(false);
                }}>Cancel</Button>
                <Button onClick={handleUpdateQty}  disabled={productHook.loading}>Update</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

    );
}
 
export default UpdateProductQty;