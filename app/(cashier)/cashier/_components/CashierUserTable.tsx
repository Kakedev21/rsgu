"use client"

import { RefreshCw } from 'lucide-react';
import Tooltip from '@/components/ToolTip';
import { useSearchParams } from 'next/navigation';
import useUser, { useUserState } from '@/hooks/useUser';
import UsersTable from '@/app/(route)/admin/(dashboard)/users/_components/users-table';
import { FC, ReactNode, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface CashierUserTableProps {
  trigger: ReactNode
}

const CashierUserTable: FC<CashierUserTableProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const userHook = useUser({ init: false });
  const userState = useUserState();
  const searchParams = useSearchParams();
  const pageOffset = Number(searchParams.get("page")) || 1;

  const handleSearch = (page: number = pageOffset, search: string | null) => {
    userHook.getAll(page, 10, search);
  }

  const handleRefresh = () => {
    userHook.getAll(pageOffset, 10,);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <div className="container py-10 space-y-5">
          <div className="flex items-center justify-between">
            <Tooltip
              trigger={
                <div className='p-3' onClick={() => handleRefresh()}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </div>
              }
              tooltip="Refresh"
            />
          </div>
          <UsersTable
            {...userHook.users}
            loading={userHook.loading}
            handleSearch={handleSearch}
            refresh={handleRefresh}
            page={pageOffset}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CashierUserTable;
