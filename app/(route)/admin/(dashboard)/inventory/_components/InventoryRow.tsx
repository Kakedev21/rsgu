"use client"
import { TableCell, TableRow } from '@/components/ui/table';
import moment from 'moment';
import { ProductProps } from '@/types/Product';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';
import Barcode from 'react-barcode';
import { useEffect, useState } from 'react';
import useProduct from '@/hooks/useProduct';

export function InventoryRow({ product, productState }: { refresh: any, product: ProductProps, productState: any }) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const productHook = useProduct({ init: false })

  const handlePrint = () => {
    const printContent = document.getElementById('barcode-' + product._id);
    if (printContent) {
      const printWindow = window.open('', '', 'height=400,width=800');
      printWindow?.document.write('<html><head><title>Print Barcode</title>');
      printWindow?.document.write('<style>body { margin: 0; } #barcode { width: 100%; } #barcode svg { width: 100% !important; }</style>');
      printWindow?.document.write('</head><body>');
      printWindow?.document.write('<div id="barcode">' + printContent.innerHTML + '</div>');
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  const handleBarcodeScan = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      try {
        const response = await productHook.getById(barcodeInput)
        if (response.product) {
          productState.setSelected(response.product)
          productState.setOpenFormDialog(true)
        }
        setBarcodeInput('');
      } catch (error) {
        console.log(error)
      }
    } else {
      setBarcodeInput((prev) => prev + event.key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleBarcodeScan);
    return () => {
      window.removeEventListener('keydown', handleBarcodeScan);
    };
  }, [barcodeInput, product]);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <p className='text-blue-500 cursor-pointer'>{product?._id?.slice(-8)}</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Barcode</DropdownMenuLabel>
              <DropdownMenuItem onClick={handlePrint}>
                <div id={'barcode-' + product._id} className="p-2">
                  <Barcode value={product?._id || ''} width={1} height={50} />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <span className={twMerge("border text-slate-600 border-green-400 rounded-full py-1 px-2 text-xs",
            product.status === "Not Available" && "border-red-400")}>
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
    </>
  );
}