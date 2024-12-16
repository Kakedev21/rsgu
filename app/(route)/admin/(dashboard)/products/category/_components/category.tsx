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
import { CategoryProps } from '@/types/Product';
import moment from "moment";
import { useCategoryState } from '@/hooks/useCategory';

export function Category({ category }: { category: CategoryProps }) {
  const categoryState = useCategoryState();
  const handleDelete = () => {
    categoryState.setSelected(category);
    categoryState.setOpenDeleteDialog(true);
  }

  const handleEdit = () => {
    categoryState.setSelected(category);
    categoryState.setOpenFormDialog(true);
  }

  return (
    <TableRow>

      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell className="font-medium">{category.productsCount || 0}</TableCell> {/* Add this line */}
      <TableCell className="font-medium">{moment(category?.createdAt).format("lll")}</TableCell>
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
              Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
