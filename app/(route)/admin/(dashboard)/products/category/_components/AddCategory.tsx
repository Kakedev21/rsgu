
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { FC, useEffect } from "react";
import { FileBox } from "lucide-react";
import AddCategoryForm from "./AddCategoryForm";


interface AddCategoryProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    refresh?: () => void;
}
const AddCategory: FC<AddCategoryProps> = ({open, onOpenChange, refresh}) => {


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="min-w-[600px]" 
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogDescription>
                        <div className="flex gap-2 items-center">
                            <FileBox className="h-10 w-10" />
                            <div className="">
                                <p className=" text-slate-700 font-semibold text-lg">Add New Category</p>
                                <span className="text-xs">Fields with (<span className="text-red-500">*</span>) are required</span>    
                            </div>
                           
                        </div>
                        <AddCategoryForm onOpenChange={onOpenChange} refresh={refresh}/>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}


export default AddCategory;