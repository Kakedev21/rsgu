"use client"

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { UserProps } from '@/types/User';
import { useUserState } from '@/hooks/useUser';
import { useSession } from 'next-auth/react';

export function User({ user }: { user: UserProps }) {
  const userState = useUserState();
  const { data: session } = useSession();
  const isSub = session?.user.subRole

  console.log("asd", isSub)

  const handleDelete = () => {
    if (isSub) return;
    userState.setSelected(user);
    userState.setOpenDeleteDialog(true);
  }

  const handleEdit = () => {
    if (isSub) return;
    userState.setSelected(user);
    userState.setOpenFormDialog(true);
  }

  const handleUpdatePassword = () => {
    if (isSub) return;
    userState.setSelected(user);
    userState.setUpdatePassword(true);
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell className="font-medium">{user.subRole ? user.subRole : user.role}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!!isSub}>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={handleEdit}
            >
              Edit
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={handleUpdatePassword}
              disabled={!!isSub}
            >
              Update Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={!!isSub}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
