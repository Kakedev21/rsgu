"use client"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { FC, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import PaidOrdersTable from "@/app/(route)/admin/(dashboard)/orders/_components/PaidOrdersTable";
import Tooltip from "@/components/ToolTip";
import useOrder from "@/hooks/useOrder";
import { useSearchParams } from "next/navigation";

interface TransactionsProps {
    trigger: ReactNode
}

const Transactions: FC<TransactionsProps> = ({ trigger }) => {
    const orderHook = useOrder({ init: false });
    const searchParams = useSearchParams();
    const pageOffset = Number(searchParams.get("page")) || 1;

    const handleSearch = (page: number = pageOffset, search: string | null) => {
        orderHook.getAllOrder({ page, limit: 10, q: search, status: "Paid" });
    }

    const handleRefresh = () => {
        orderHook.getAllOrder({ page: pageOffset, limit: 10, status: "Paid" });
    }

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
                    <div>
                        <div className="flex items-center gap-2 justify-end">
                            <Tooltip
                                trigger={
                                    <div className='p-3' onClick={() => handleRefresh()}>
                                        <RefreshCw className="h-3.5 w-3.5" />
                                    </div>
                                }
                                tooltip="Refresh"
                            />
                        </div>
                        <PaidOrdersTable
                            {...orderHook.orders}
                            loading={orderHook.loading}
                            handleSearch={handleSearch}
                            refresh={handleRefresh}
                            page={pageOffset}
                        />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default Transactions;