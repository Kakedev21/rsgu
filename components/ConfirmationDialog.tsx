import { FC, ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";


interface ConfirmDialogProps {
    title?: string;
    open?: boolean;
    description?: string | ReactNode;
    onOpenChange?: (value: boolean) => void;
    confirmLabel?: string;
    handleClickConfirm?: () => void;
    cancelLabel?: string;
    handleClickCancel?: () => void;
}
const ConfirmDialog: FC<ConfirmDialogProps> = ({title, description, open, onOpenChange, confirmLabel, cancelLabel, handleClickConfirm, handleClickCancel}) => {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={handleClickCancel} variant="ghost">{cancelLabel}</Button>
                    <Button onClick={handleClickConfirm}>{confirmLabel}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}


export default ConfirmDialog;