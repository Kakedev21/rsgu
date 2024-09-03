

"use client"

import { PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductsTable from './products-table';
import AddProduct from './AddProduct';
import Tooltip from '@/components/ToolTip';
import useProduct, { useProductState } from '@/hooks/useProduct';
import { useSearchParams } from 'next/navigation';


const ProductsContentPage = () => {
  const productHook = useProduct({init: false});
  const productState = useProductState();
  const searchParams = useSearchParams();
  const pageOffset =  Number(searchParams.get("page")) || 1;
  const handleSearch = (page: number = pageOffset, search: string | null) => {
    console.log("triffer", page, pageOffset)
    productHook.getAll(page, 5, search);
  }
  const handleRefresh = () => {
    productHook.getAll(pageOffset, 5);
  }

  return (
    <div className="mt-5 space-y-5">
      <div className="flex items-center gap-2 justify-end">
        <Tooltip
          trigger={
            <div className='p-3'  onClick={() => handleRefresh()}>
              <RefreshCw className="h-3.5 w-3.5"/>
            </div>
          }
          tooltip="Refresh"
        />
        <Button size="sm" className="h-8 gap-1" onClick={() => {
          productState.setSelected(null);
          productState.setOpenFormDialog(true);
        }}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Product
          </span>
        </Button>
      </div>
      <ProductsTable
       {...productHook.products}
       loading={productHook.loading}
       handleSearch={handleSearch}
       refresh={handleRefresh}
       page={pageOffset}
      />
      <AddProduct
        open={productState.openFormDialog}
        onOpenChange={(value) => productState.setOpenFormDialog(value)}
        refresh={handleRefresh}
      />
    </div>
    
  );
}

export default ProductsContentPage;
