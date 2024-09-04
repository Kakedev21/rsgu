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


export function User({ user }: { user: UserProps }) {
  const userState = useUserState();
  const handleDelete = () => {
    userState.setSelected(user);
    userState.setOpenDeleteDialog(true);
  }

  const handleEdit = () => {
    userState.setSelected(user);
    userState.setOpenFormDialog(true);
  }

  const handleUpdatePassword = () => {
    userState.setSelected(user);
    userState.setUpdatePassword(true);
  }
  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="font-medium">{user.department}</TableCell>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={handleEdit}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleUpdatePassword}
            >
              Update Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
            >
              Delete

            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
