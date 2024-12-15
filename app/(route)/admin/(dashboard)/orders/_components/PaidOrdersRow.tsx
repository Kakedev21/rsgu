"use client"

import { TableCell, TableRow } from '@/components/ui/table';
import moment from 'moment';
import numeral from "numeral";
import { OrderProps } from '@/types/Order';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import Slip from '@/app/(cashier)/cashier/_components/Slip';

export function PaidOrdersRow({ order }: { order: OrderProps }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <p
            className='text-blue-500 cursor-pointer'
            onClick={() => setOpen(true)}
          >
            {order?._id?.slice(-8)}
          </p>
        </TableCell>
        <TableCell className="font-medium">₱{numeral(order.totalAmount).format("0,0.00")}</TableCell>
        <TableCell className="font-medium">
          {moment(order?.createdAt).format("llll")}
        </TableCell>
        <TableCell className="font-medium">{moment(order?.updatedAt).format("llll")}</TableCell>
        <TableCell className="font-medium">
          <p>{order?.cashier?.name}</p>
        </TableCell>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[800px]">
          <Slip orderData={[order]} />
        </DialogContent>
      </Dialog>
    </>
  );
}
