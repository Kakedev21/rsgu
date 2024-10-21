

"use client"

import { PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddProduct from './AddUser';
import Tooltip from '@/components/ToolTip';
import { useSearchParams } from 'next/navigation';
import useUser, { useUserState } from '@/hooks/useUser';
import UsersTable from './users-table';
import AddUser from './AddUser';


const UsersContentPage = () => {
  const userHook = useUser({init: false});
  const userState = useUserState();
  const searchParams = useSearchParams();
  const pageOffset =  Number(searchParams.get("page")) || 1;
  const handleSearch = (page: number = pageOffset, search: string | null) => {
    userHook.getAll(page, 10, search);
  }
  const handleRefresh = () => {
    userHook.getAll(pageOffset, 10);
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
          userState.setSelected(null);
          userState.setOpenFormDialog(true);
        }}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add User
          </span>
        </Button>
      </div>
      <UsersTable
       {...userHook.users}
       loading={userHook.loading}
       handleSearch={handleSearch}
       refresh={handleRefresh}
       page={pageOffset}
      />
      <AddUser
        open={userState.openFormDialog}
        onOpenChange={(value) => userState.setOpenFormDialog(value)}
        refresh={handleRefresh}
      />
    </div>
    
  );
}

export default UsersContentPage;
