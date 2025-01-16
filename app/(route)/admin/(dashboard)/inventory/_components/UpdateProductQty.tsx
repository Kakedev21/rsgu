"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { UseProductStateProps } from "@/hooks/useProduct";
import { FC, useRef, useState } from "react";
import { boolean } from "zod";
import useReport from "@/hooks/useReport";
interface UpdateProductQtyProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  productState: UseProductStateProps;
  productHook: any;
  handleRefresh: any;
}

const UpdateProductQty: FC<UpdateProductQtyProps> = ({ open, onOpenChange, productState, productHook, handleRefresh }) => {
  const qtyRef = useRef<any>();
  const { toast } = useToast();
  const [isIncrement, setIsIncrement] = useState(true);
  const reportHook = useReport()


  const handleUpdateQty = async () => {
    const currentQty = productState.selected?.quantity || 0;
    const changeAmount = Number(qtyRef?.current?.value) || 0;
    const newQuantity = isIncrement ? currentQty + changeAmount : currentQty - changeAmount;

    const products = await productHook?.update({
      quantity: newQuantity,
    }, productState.selected?._id);

    const reportUpdate = await reportHook.update({
      productId: products.product?._id,
      endingInventory: {
        quantity: products.product.quantity,
      }
    });

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
          <div className="pt-5 space-y-5">
            <div className="flex items-center justify-between">
              <Label>Operation</Label>
              <div className="flex items-center gap-2">
                <Label>{isIncrement ? "Add" : "Remove"}</Label>
                <Switch
                  checked={isIncrement}
                  onCheckedChange={setIsIncrement}
                  disabled={productHook.loading}
                />
              </div>
            </div>
            <div>
              <Label>Add Quantity</Label>
              <Input
                type="number"
                placeholder="Enter quantity to change"
                ref={qtyRef}
                disabled={productHook.loading}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Current quantity: {productState.selected?.quantity || 0}
              </p>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost"
            disabled={productHook.loading}
            onClick={() => {
              productState.setSelected(null);
              productState.setOpenFormDialog(false);
            }}>Cancel</Button>
          <Button onClick={handleUpdateQty} disabled={productHook.loading}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProductQty;
