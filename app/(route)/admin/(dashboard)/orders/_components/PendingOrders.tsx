"use client"

import Tooltip from "@/components/ToolTip";

import { RefreshCw } from "lucide-react";
import PendingOrdersTable from "./PendingOrdersTable";
import useOrder, { useOrderState } from "@/hooks/useOrder";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const PendingOrders = () => {
    const orderHook = useOrder({init: false});
    const searchParams = useSearchParams();
    const pageOffset =  Number(searchParams.get("page")) || 1;
    const handleSearch = (page: number = pageOffset, search: string | null) => {
        
        orderHook.getAllOrder({page, limit: 5, q: search, status: "Pending"});
    }
    const handleRefresh = () => {
        orderHook.getAllOrder({page: pageOffset, limit:5, status: "Pending"});
    }
    
    return <div>
      <div className="flex items-center gap-2 justify-end">
        <Tooltip
          trigger={
            <div className='p-3'  onClick={() => handleRefresh()}>
              <RefreshCw className="h-3.5 w-3.5"/>
            </div>
          }
          tooltip="Refresh"
        />
      </div>
      <PendingOrdersTable
       {...orderHook.orders}
       loading={orderHook.loading}
       handleSearch={handleSearch}
       refresh={handleRefresh}
       page={pageOffset}
      />
    
    </div>
}
 
export default PendingOrders;