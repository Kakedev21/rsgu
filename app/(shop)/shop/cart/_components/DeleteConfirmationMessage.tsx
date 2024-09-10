import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FC, ReactNode } from "react";

interface DeleteConfirmationMessageProps {
    children: ReactNode;
    onConfirm: () => void;
}
const DeleteConfirmationMessage:FC<DeleteConfirmationMessageProps> = ({children, onConfirm}) => {

    return <Dialog>
    <DialogTrigger>{children}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your cart item
          and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="destructive" onClick={onConfirm}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
}

export default DeleteConfirmationMessage;