import { RefreshCw } from "lucide-react";
import PaidOrdersTable from "./PaidOrdersTable";
import Tooltip from "@/components/ToolTip";
import useOrder from "@/hooks/useOrder";
import { useSearchParams } from "next/navigation";

const PaidOrders = () => {
    const orderHook = useOrder({init: false});
    const searchParams = useSearchParams();
    const pageOffset =  Number(searchParams.get("page")) || 1;
    const handleSearch = (page: number = pageOffset, search: string | null) => {
        
        orderHook.getAllOrder({page, limit: 5, q: search, status: "Paid"});
    }
    const handleRefresh = () => {
        orderHook.getAllOrder({page: pageOffset, limit:5, status: "Paid"});
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
      <PaidOrdersTable
       {...orderHook.orders}
       loading={orderHook.loading}
       handleSearch={handleSearch}
       refresh={handleRefresh}
       page={pageOffset}
      />
    
    </div>
}
 
export default PaidOrders;