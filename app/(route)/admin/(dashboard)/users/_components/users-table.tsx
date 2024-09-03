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
import {  User } from './user';
import SearchInput from '@/components/SearchInput';
import { FC, useEffect } from 'react';
import useDebounce from '@/hooks/useDebounce';
import ConfirmDialog from '@/components/ConfirmationDialog';
import { UserProps } from '@/types/User';
import useUser, { useUserState } from '@/hooks/useUser';

interface UserTableProps {
  users?: UserProps[];
  count?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  handleSearch?: (page: number, search: string | null) => void;
  refresh?: () => void;
}
const UsersTable: FC<UserTableProps> = ({users, count = 0, limit = 10, page = 1, loading = true, handleSearch, refresh}) => {
  const debounce = useDebounce();
  const userState = useUserState();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userHook = useUser({init: false});
  const router = useRouter();
  const itemsCount = (users?.length || 0) + limit;
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
    if (handleSearch) {
      handleSearch(page, debounce.debounceValue);
    }
  }, [page, debounce.debounceValue]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 space-y-10">
      <div className='w-full flex justify-between items-center'>
        <div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-slate-700">Users</h3>
          <p className='text-xs'>
            Manage your users.
          </p>
        </div>
        <div className='mt-2 w-1/2'>
          <SearchInput
            placeholder="Search user..."
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
            <TableHead>Department</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <User key={user?.["_id"]} user={user} />
          ))}
        </TableBody>
      </Table>}
      <div className="flex items-center w-full justify-between border-t border-slate-100">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {Math.min(page === 1 ? (users?.length || limit) : itemsCount * (page - 1), count)}
          </strong>{' '}
          of <strong>{count}</strong> products
        </div>
        <div className="flex">
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
      </div>
      <ConfirmDialog
          title="Delete Confirmation"
          description="This action cannot be undone. This will permanently delete your account
        and remove your data from our servers."
          open={userState.openDeleteDialog}
          onOpenChange={userState.setOpenDeleteDialog}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          handleClickConfirm={async () => {
            userState.setOpenDeleteDialog(false);
            await userHook.deleteUser(userState.selected?._id as string);
            userState.setSelected(null);
            userHook.getAll(Number(page), Number(limit));
            if (refresh) {
              refresh();
            }
          }}
          handleClickCancel={() => {
            userState.setSelected(null);
            userState.setOpenDeleteDialog(false);
          }}
        />
    </div>
  );
}
export default UsersTable;