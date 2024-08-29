import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FC } from "react";
import AddProductForm from "./AddProductForm";
import { Package } from "lucide-react";


interface AddProductProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
}
const AddProduct: FC<AddProductProps> = ({open, onOpenChange}) => {


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="min-w-[800px]" 
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogDescription>
                        <div className="flex gap-2 items-center">
                            <Package className="h-10 w-10" />
                            <div className="">
                                <p className=" text-slate-700 font-semibold text-lg">Add New Product</p>
                                <span className="text-xs">Fields with (<span className="text-red-500">*</span>) are required</span>    
                            </div>
                           
                        </div>
                        <AddProductForm onOpenChange={onOpenChange}/>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}


export default AddProduct;