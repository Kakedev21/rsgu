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
  CardTitle
} from '@/components/ui/card';


import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from './product';
import SearchInput from '@/components/SearchInput';
import { ProductProps } from '@/types/Product';
import { FC, useEffect } from 'react';
import useDebounce from '@/hooks/useDebounce';
import useProduct, { useProductState } from '@/hooks/useProduct';
import ConfirmDialog from '@/components/ConfirmationDialog';

interface ProductTableProps {
  products?: ProductProps[];
  count?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  handleSearch?: (page: number, search: string | null) => void;
  refresh?: () => void;
}
const ProductsTable: FC<ProductTableProps> = ({products, count = 0, limit = 10, page = 1, loading = true, handleSearch, refresh}) => {
  const debounce = useDebounce();
  const productState = useProductState();

  const productHook = useProduct({init: false});
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
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-slate-700">Products</h3>
          <p className='text-xs'>
            Manage your products.
          </p>
        </div>
        <div className='mt-2 w-1/2'>
          <SearchInput
            placeholder="Search Product..."
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
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <Product key={product?.["_id"]} product={product} />
          ))}
        </TableBody>
      </Table>}
      <div className="flex items-center w-full justify-between border-t border-slate-100">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {Math.min(10 - 1, count)}
          </strong>{' '}
          of <strong>{count}</strong> products
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
      </div>
      <ConfirmDialog
          title="Delete Confirmation"
          description="This action cannot be undone. This will permanently delete your account
        and remove your data from our servers."
          open={productState.openDeleteDialog}
          onOpenChange={productState.setOpenDeleteDialog}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          handleClickConfirm={async () => {
            productState.setOpenDeleteDialog(false);
            await productHook.deleteProduct(productState.selected?._id as string);
            productState.setSelected(null);
            productHook.getAll(Number(page), Number(limit));
            if (refresh) {
              refresh();
            }
          }}
          handleClickCancel={() => {
            productState.setSelected(null);
            productState.setOpenDeleteDialog(false);
          }}
        />
    </div>
  );
}
export default ProductsTable;