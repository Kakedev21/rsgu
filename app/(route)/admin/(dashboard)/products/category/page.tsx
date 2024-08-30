

"use client"

import { PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AddCategory from './_components/AddCategory';
import Tooltip from '@/components/ToolTip';
import useCategory, { useCategoryState } from '@/hooks/useCategory';
import CategoryTable from './category-table';
import { CategoryProps } from '@/types/Product';
import { useSearchParams } from 'next/navigation';


const ProductsCategoryPage = () => {
  const categoryState = useCategoryState();
  const categoryHook = useCategory({init: true});
  const searchParams = useSearchParams();
  const pageOffset =  Number(searchParams.get("page")) || 1
  const handleSearch = (page: number = pageOffset, search: string | null) => {
    categoryHook.getAllCategory(page, 10, search);
  }

  const handleRefresh = () => {
    categoryHook.getAllCategory(pageOffset, 10);
  }
  return (
    <div className="mt-5 space-y-5">
      <div className="flex items-center gap-2 justify-end">
        <Tooltip
          trigger={
            <div className='p-3'  onClick={handleRefresh}>
              <RefreshCw className="h-3.5 w-3.5"/>
            </div>
          }
          tooltip="Refresh"
        />
        <Button size="sm" className="h-8 gap-1" onClick={() => {
          categoryState.setSelected(null);
          categoryState.setOpenFormDialog(true);
        }}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Category
          </span>
        </Button>
      </div>
      <CategoryTable
        {...categoryHook.categories}
        loading={categoryHook.loading}
        handleSearch={handleSearch}
        refresh={handleRefresh}
      />
      <AddCategory
        open={categoryState.openFormDialog}
        onOpenChange={(value) => categoryState.setOpenFormDialog(value)}
        refresh={handleRefresh}
      />
    </div>
    
  );
}

export default ProductsCategoryPage;
