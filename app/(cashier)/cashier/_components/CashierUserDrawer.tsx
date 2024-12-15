"use client"

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { FC, ReactNode, useState } from "react";
import AddUserForm from "@/app/(route)/admin/(dashboard)/users/_components/AddUserForm";

interface CashierUserDrawerProps {
  trigger: ReactNode
}

const CashierUserDrawer: FC<CashierUserDrawerProps> = ({ trigger }) => {
  const [open, setOpen] = useState(true);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <div className="container py-10 space-y-5">
          <div>
            <p className="font-bold text-lg">Add User</p>
          </div>
          <AddUserForm onOpenChange={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CashierUserDrawer;