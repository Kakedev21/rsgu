"use client"

import Tooltip from "@/components/ToolTip";

import { RefreshCw } from "lucide-react";

import useOrder, { useOrderState } from "@/hooks/useOrder";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import InventoryTable from "./InventoryTable";
import useProduct, { useProductState } from "@/hooks/useProduct";
import UpdateProductQty from "./UpdateProductQty";

const InventoryContent = () => {
    const productState = useProductState();
    const productHook = useProduct({init: false})
    const searchParams = useSearchParams();
    const pageOffset =  Number(searchParams.get("page")) || 1;
    const handleSearch = (page: number = pageOffset, search: string | null) => {
        
      productHook.getAll(page, 10, search);
    }
    const handleRefresh = () => {
      productHook.getAll(pageOffset, 10);
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
      <InventoryTable
       {...productHook.products}
       loading={productHook.loading}
       handleSearch={handleSearch}
       refresh={handleRefresh}
       page={pageOffset}
       productState={productState}
      />
      <UpdateProductQty
        open={productState.openFormDialog}
        onOpenChange={productState.setOpenFormDialog}
        productState={productState}
        productHook={productHook}
        handleRefresh={handleRefresh}
      />
    
    </div>
}
 
export default InventoryContent;