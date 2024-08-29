

"use client"

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
import AddProduct from './_components/AddProduct';
import { useState } from 'react';


const ProductsPage = () => {
  const [openAddProduct, setOpenAddProduct] = useState<boolean>( false )
 

  return (
    <div className="mt-5 space-y-5">
      <div className="flex items-center gap-2 justify-end">
        <Button size="sm" className="h-8 gap-1" onClick={() => setOpenAddProduct(true)}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Item
          </span>
        </Button>
      </div>
      <ProductsTable
        products={[]}
        offset={0}
        totalProducts={0}
      />
      <AddProduct
        open={openAddProduct}
        onOpenChange={(value) => setOpenAddProduct(value)}
      />
    </div>
    
  );
}

export default ProductsPage;
