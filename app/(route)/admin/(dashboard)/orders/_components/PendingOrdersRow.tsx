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
import { useProductState } from '@/hooks/useProduct';
import moment from 'moment';
import numeral from "numeral";
import { OrderProps } from '@/types/Order';
import { useOrderState } from '@/hooks/useOrder';


export function PendingOrdersRow({ order }: { order: OrderProps }) {
  const orderState = useOrderState();
  const handleDelete = () => {
    orderState.setSelected(order);
    orderState.setOpenDeleteDialog(true);
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <p className='text-blue-500 cursor-pointer'>{order?._id?.slice(-8)}</p>
      </TableCell>
      <TableCell className="font-medium">₱{numeral(order.totalAmount).format("0,0.00")}</TableCell>
      <TableCell className="font-medium">
        {moment(order?.createdAt).format("llll")}
      </TableCell>
      <TableCell className="font-medium">{moment(order?.updatedAt).format("llll")}</TableCell>
     
      {/* <TableCell>
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
              onClick={handleDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell> */}
    </TableRow>
  );
}
