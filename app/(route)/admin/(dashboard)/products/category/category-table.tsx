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


import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from './category';
import SearchInput from '@/components/SearchInput';
import useCategory from '@/hooks/useCategory';

export function CategoryTable({
  offset,
  total
}: {
  offset: number;
  total: number;
}) {
  const categoryHook = useCategory({init:true, page: 0, limit: 10});
  const router = useRouter();
  const categoryPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
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
              />
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryHook.categories?.categories?.map((category) => (
              <Category key={category?.["_id"]} category={category} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min(offset - categoryPerPage, total) + 1}-{offset}
            </strong>{' '}
            of <strong>{total}</strong> categories
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === categoryPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + categoryPerPage > total}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
