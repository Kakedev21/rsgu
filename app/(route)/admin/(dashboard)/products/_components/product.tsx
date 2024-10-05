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
import { ProductProps } from '@/types/Product';
import { useProductState } from '@/hooks/useProduct';
import moment from 'moment';
import numeral from "numeral";


export function Product({ product }: { product: ProductProps }) {
  const productState = useProductState();
  const handleDelete = () => {
    productState.setSelected(product);
    productState.setOpenDeleteDialog(true);
  }

  const handleEdit = () => {
    productState.setSelected(product);
    productState.setOpenFormDialog(true);
  }
  return (
    <TableRow>
      <TableCell className="font-medium">{product.productId}</TableCell>
      <TableCell className="font-medium">
          <img src={product.image as string || "/no-image.png"} className='w-[300px] h-[150px] rounded'/>
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="font-medium">{product.description}</TableCell>
      <TableCell className="font-medium">{numeral(product.price).format("0,0.00")}</TableCell>
      <TableCell className="font-medium">{product.quantity}</TableCell>
      <TableCell className="font-medium">{moment(product?.createdAt).format("ll")}</TableCell>
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
