import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { FC } from "react";
import { Package } from "lucide-react";
import AddUserForm from "./AddUserForm";


interface AddUserProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    refresh?: () => void;
}
const AddUser: FC<AddUserProps> = ({open, onOpenChange}) => {


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
                                <p className=" text-slate-700 font-semibold text-lg">Add New User</p>
                                <span className="text-xs">Fields with (<span className="text-red-500">*</span>) are required</span>    
                            </div>
                           
                        </div>
                        <AddUserForm onOpenChange={onOpenChange}/>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}


export default AddUser;