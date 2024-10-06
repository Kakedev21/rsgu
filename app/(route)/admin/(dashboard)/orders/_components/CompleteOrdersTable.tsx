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

import SearchInput from '@/components/SearchInput';
import { FC, useEffect } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { OrderProps } from '@/types/Order';
import { orderBy } from 'lodash';
import { CompleteOrdersRow } from './CompleteOrdersRow';

interface CompleteOrderTableProps {
  orders?: OrderProps[];
  count?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  handleSearch?: (page: number, search: string | null) => void;
  refresh?: () => void;
}
const CompleteOrdersTable: FC<CompleteOrderTableProps> = ({orders, count = 0, limit = 10, page = 1, loading = true, handleSearch, refresh}) => {
  const debounce = useDebounce();
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const itemsCount = (orders?.length || 0) + limit;
  const prevPage = () => {
    const queryParams ={...Object.fromEntries(searchParams.entries()), page: (page - 1)+""};
    const newQueryString = new URLSearchParams(queryParams).toString();
    router.push(`${pathname}?${newQueryString}`, { scroll: true})
    
  }

  const nextPage = () => {
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
    <div className=" p-5 space-y-10">
      <div className='w-full flex justify-between items-center'>
        <div className='w-1/2'>
          <SearchInput
            placeholder="Search Order..."
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
            <TableHead>Order No</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Admin</TableHead>
            {/* <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderBy((orders || []), ["createdAt"], ["desc"])?.map((order) => (
            <CompleteOrdersRow key={order?.["_id"]} order={order} />
          ))}
        </TableBody>
      </Table>}
      <div className="flex items-center w-full justify-between border-t border-slate-100">
        <div className="mt-3 text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {Math.min(page === 1 ? (orders?.length || limit) : itemsCount * (page - 1), count)}
          </strong>{' '}
          of <strong>{count}</strong> Orders
        </div>
        <div className="mt-3 flex">
          <Button
            onClick={prevPage}
            variant="ghost"
            size="sm"
            disabled={!(page > 1)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Prev
          </Button>
          <Button
            onClick={nextPage}
            variant="ghost"
            size="sm"
            disabled={(page) >= Math.ceil(count / limit)}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default CompleteOrdersTable;