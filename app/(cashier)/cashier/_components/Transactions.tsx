
import {
    Drawer,
    DrawerContent,
 
    DrawerTrigger,
  } from "@/components/ui/drawer"

import { FC, ReactNode } from "react";
import TransactionDrawer from "./TransactionDrawer";


interface TransactionsProps {
    trigger: ReactNode
}

const Transactions:FC<TransactionsProps> = ({trigger}) => {
   
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>
            <DrawerContent>
                <div className="container py-10 space-y-5">
                    <div>
                        <p className="font-bold text-lg">Transactions</p>
                    </div>
                    <TransactionDrawer/>
                    
                </div>
            </DrawerContent>
        </Drawer>

    );
}
 
export default Transactions;