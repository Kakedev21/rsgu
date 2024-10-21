"use client"


import { TableCell, TableRow } from '@/components/ui/table';

import moment from 'moment';
import numeral from "numeral";
import { ProductProps } from '@/types/Product';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { UseProductStateProps } from '@/hooks/useProduct';
import { twMerge } from 'tailwind-merge';


export function InventoryRow({ product, productState }: { product: ProductProps, productState: UseProductStateProps }) {
  


  return (
    <TableRow>
      <TableCell className="font-medium">
        <p className='text-blue-500 cursor-pointer'>{product?._id?.slice(-8)}</p>
      </TableCell>
      <TableCell className="font-medium">
        <p>{product?.productId}</p>
      </TableCell>
      <TableCell className="font-medium">
        <div>
          <p>{product?.name}</p>
          <p className='text-xs text-slate-600'>{product?.description}</p>
        </div>
      </TableCell>
      <TableCell className="font-medium">{product.quantity}</TableCell>
      <TableCell className="font-medium">
        <span className={twMerge("border text-slate-600 border-green-400 rounded-full py-1 px-2 text-xs", product.status === "Not Available" && " border-red-400")}>
          {product.status || "Available"}
        </span>
      </TableCell>
      <TableCell className="font-medium">{moment(product?.updatedAt).format("llll")}</TableCell>
     
      <TableCell>
        <Button
          onClick={() => {
            productState.setSelected(product)
            productState.setOpenFormDialog(true)
          }}
        >
          Update Qty
        </Button>
      </TableCell>
    </TableRow>
  );
}
