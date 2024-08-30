'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';


import { useRouter, useSearchParams } from 'next/navigation';
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



  function prevPage() {
    router.back();
  }

  function nextPage() {
    // router.push(`/?offset=${offset}`, { scroll: false });
  }

  useEffect(() => {
    if (handleSearch) {
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
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min(10 - 1, count)}
            </strong>{' '}
            of <strong>{count}</strong> categories
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={!(Math.ceil(count / Number(limit)) > Number(page))}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={Number(page) + Number(limit) > (count as number)}
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
