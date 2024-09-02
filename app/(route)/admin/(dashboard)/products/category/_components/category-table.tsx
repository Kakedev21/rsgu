'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';



import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from './category';
import SearchInput from '@/components/SearchInput';
import useCategory, { useCategoryState } from '@/hooks/useCategory';
import { FC, useEffect, useMemo } from 'react';
import ConfirmDialog from '@/components/ConfirmationDialog';
import useDebounce from '@/hooks/useDebounce';
import { CategoryProps } from '@/types/Product';


interface CategoryTableProps {
  categories?: CategoryProps[];
  count?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  handleSearch?: (page: number, search: string | null) => void;
  refresh?: () => void;
}
const CategoryTable: FC<CategoryTableProps> = ({categories, count = 0, limit = 10, page = 1, loading = true, handleSearch, refresh}) => {
  const debounce = useDebounce();
  const categoryState = useCategoryState();
  const categoryHook = useCategory({init: false});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const itemsCount = (categories?.length || 0) + limit;


  function prevPage() {
    const queryParams ={...Object.fromEntries(searchParams.entries()), page: (page - 1)+""};
    const newQueryString = new URLSearchParams(queryParams).toString();
    router.push(`${pathname}?${newQueryString}`, { scroll: true})
    
  }

  function nextPage() {
    const queryParams ={...Object.fromEntries(searchParams.entries()), page: (page + 1)+""};
    const newQueryString = new URLSearchParams(queryParams).toString();
    router.push(`${pathname}?${newQueryString}`, { scroll: true})
  }

  useEffect(() => {
    if (handleSearch && !loading) {
      handleSearch(page, debounce.debounceValue);
    }
  }, [page, debounce.debounceValue]);
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 space-y-10">
        <div className='w-full flex justify-between items-center'>
            <div>
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-slate-700">Products Category</h3>
              <p className='text-xs'>
                Manage your product categories.
              </p>
            </div>
            <div className='mt-2 w-1/2'>
              <SearchInput
                placeholder="Search category..."
                onChange={(event) => debounce.setValue(event.target.value)}
              />
            </div>
          </div>
          {
            loading && <div className='w-full flex justify-center p-5 items-center gap-2'>
              <LoaderCircle className=' animate-spin text-slate-600' />
              <p className='text-slate-600 animate-pulse'>Loading...</p>
            </div>
          }
          {!loading && <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <Category key={category?.["_id"]} category={category} />
              ))}
            </TableBody>
          </Table>}
        <form className="flex items-center w-full justify-between border-t border-slate-100">
          <div className="mt-3  text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min(page === 1 ? (categories?.length || limit) : itemsCount * (page - 1), count)}
            </strong>{' '}
            of <strong>{count}</strong> categories
          </div>
          <div className="mt-3  flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={!(page > 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={(page) >= Math.ceil(count / limit)}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
        <ConfirmDialog
          title="Delete Confirmation"
          description="This action cannot be undone. This will permanently delete your account
        and remove your data from our servers."
          open={categoryState.openDeleteDialog}
          onOpenChange={categoryState.setOpenDeleteDialog}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          handleClickConfirm={async () => {
            categoryState.setOpenDeleteDialog(false);
            await categoryHook.deleteCategory(categoryState.selected?._id as string);
            categoryState.setSelected(null);
            categoryHook.getAllCategory(Number(page), Number(limit));
            if (refresh) {
              refresh();
            }
          }}
          handleClickCancel={() => {
            categoryState.setSelected(null);
            categoryState.setOpenDeleteDialog(false);
          }}
        />
    </div>
  );
}

export default CategoryTable;
