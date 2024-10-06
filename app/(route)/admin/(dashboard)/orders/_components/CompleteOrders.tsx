import useOrder from "@/hooks/useOrder";
import CompleteOrdersTable from "./CompleteOrdersTable";
import { useSearchParams } from "next/navigation";
import Tooltip from "@/components/ToolTip";
import { RefreshCw } from "lucide-react";

const CompleteOrders = () => {
    const orderHook = useOrder({init: false});
    const searchParams = useSearchParams();
    const pageOffset =  Number(searchParams.get("page")) || 1;
    const handleSearch = (page: number = pageOffset, search: string | null) => {
        
        orderHook.getAllOrder({page, limit: 5, q: search, status: "Completed"});
    }
    const handleRefresh = () => {
        orderHook.getAllOrder({page: pageOffset, limit:5, status: "Completed"});
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
      <CompleteOrdersTable
       {...orderHook.orders}
       loading={orderHook.loading}
       handleSearch={handleSearch}
       refresh={handleRefresh}
       page={pageOffset}
      />
    
    </div>
}
 
export default CompleteOrders;