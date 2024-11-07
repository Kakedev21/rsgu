"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useReport from "@/hooks/useReport";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';

const RecordsPage = () => {
    const reportHook = useReport();
    const [subTotal, setSubTotal] = useState({ unitCost: 0, unitPrice: 0 });

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                await reportHook.getReportByDay();
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        fetchRecords();
    }, []);

    useEffect(() => {
        let totalUnitCost = 0;
        let totalUnitPrice = 0;

        reportHook.reports?.forEach((record) => {
            totalUnitCost += (record.beginningInventory?.quantity || 0) * (record.beginningInventory?.unitCost || 0);
            totalUnitPrice += (record.endingInventory?.quantity || 0) * (record.endingInventory?.unitPrice || 0);
        });

        setSubTotal({ unitCost: totalUnitCost, unitPrice: totalUnitPrice });
    }, [reportHook.reports?.length]);

    const exportToExcel = () => {
        // Create worksheet data with headers
        const headers = [
            ['INVENTORY RECORDS REPORT'],
            ['Date:', new Date().toLocaleDateString()],
            [],
            ['ITEMS', 'UNIT COST (UC)', 'UNIT PRICE (UP)', 'BEGINNING INVENTORY', '', '', 'SALES', '', '', 'ENDING INVENTORY', '', ''],
            ['', '', '', 'QTY', 'UC', 'UP', 'QTY', 'UC', 'UP', 'QTY', 'UC', 'UP']
        ];

        // Add data rows
        const rows = reportHook.reports?.map(record => [
            record.productId?.name || '',
            record.beginningInventory?.unitCost || '',
            record.beginningInventory?.unitPrice || '',
            record.beginningInventory?.quantity || '',
            record.beginningInventory?.unitCost || '',
            record.beginningInventory?.unitPrice || '',
            record.sales?.quantity || '',
            record.sales?.unitCost || '',
            record.sales?.unitPrice || '',
            record.endingInventory?.quantity || '',
            record.endingInventory?.unitCost || '',
            record.endingInventory?.unitPrice || ''
        ]) || [];

        // Add subtotal row
        const subtotalRow = [
            'Sub Total',
            subTotal.unitCost,
            subTotal.unitPrice,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        ];

        // Combine all rows
        const wsData = [...headers, ...rows, [], subtotalRow];

        // Create worksheet and set column widths
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const colWidths = [
            { wch: 30 }, // Items
            { wch: 15 }, // UC
            { wch: 15 }, // UP
            { wch: 10 }, // Beginning QTY
            { wch: 10 }, // Beginning UC
            { wch: 10 }, // Beginning UP
            { wch: 10 }, // Sales QTY
            { wch: 10 }, // Sales UC
            { wch: 10 }, // Sales UP
            { wch: 10 }, // Ending QTY
            { wch: 10 }, // Ending UC
            { wch: 10 }  // Ending UP
        ];
        ws['!cols'] = colWidths;

        // Merge cells for title and date
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }, // Title
            { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },  // Date
            { s: { r: 3, c: 3 }, e: { r: 3, c: 5 } },  // Beginning Inventory
            { s: { r: 3, c: 6 }, e: { r: 3, c: 8 } },  // Sales
            { s: { r: 3, c: 9 }, e: { r: 3, c: 11 } }  // Ending Inventory
        ];

        // Create workbook and add worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventory Records");

        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        const filename = `inventory_records_${date}.xlsx`;

        // Save file
        XLSX.writeFile(wb, filename);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Inventory Records</h1>
                <Button onClick={exportToExcel} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export to Excel
                </Button>
            </div>

            <Card className="p-4">
                <Table className="border border-gray-300">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center border border-gray-300">ITEMS</TableHead>
                            <TableHead className="text-center border border-gray-300">UNIT COST (UC)</TableHead>
                            <TableHead className="text-center border border-gray-300">UNIT PRICE (UP)</TableHead>
                            <TableHead className="text-center border border-gray-300">BEGINNING INVENTORY</TableHead>
                            <TableHead className="text-center border border-gray-300">SALES</TableHead>
                            <TableHead className="text-center border border-gray-300">ENDING INVENTORY</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportHook.reports?.map((record) => (
                            <TableRow key={record._id} className="border border-gray-300">
                                <TableCell className="text-center border border-gray-300">{record.productId?.name}</TableCell>
                                <TableCell className="text-center border border-gray-300">
                                    {record.beginningInventory?.unitCost !== 0 ? record.beginningInventory?.unitCost : ''}
                                </TableCell>
                                <TableCell className="text-center border border-gray-300">
                                    {record.beginningInventory?.unitPrice !== 0 ? record.beginningInventory?.unitPrice : ''}
                                </TableCell>
                                <TableCell className="text-center border border-gray-300">
                                    <div>QTY: {record.beginningInventory?.quantity !== 0 ? record.beginningInventory?.quantity : ''}</div>
                                    <div>UC: {record.beginningInventory?.unitCost !== 0 ? record.beginningInventory?.unitCost : ''}</div>
                                    <div>UP: {record.beginningInventory?.unitPrice !== 0 ? record.beginningInventory?.unitPrice : ''}</div>
                                </TableCell>

                                <TableCell className="text-center border border-gray-300">
                                    <div>QTY: {record.sales?.quantity !== 0 ? record.sales?.quantity : ''}</div>
                                    <div>UC: {record.sales?.unitCost !== 0 ? record.sales?.unitCost : ''}</div>
                                    <div>UP: {record.sales?.unitPrice !== 0 ? record.sales?.unitPrice : ''}</div>
                                </TableCell>

                                <TableCell className="text-center border border-gray-300">
                                    <div>QTY: {record.endingInventory?.quantity !== 0 ? record.endingInventory?.quantity : ''}</div>
                                    <div>UC: {record.endingInventory?.unitCost !== 0 ? record.endingInventory?.unitCost : ''}</div>
                                    <div>UP: {record.endingInventory?.unitPrice !== 0 ? record.endingInventory?.unitPrice : ''}</div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-between mt-4">
                    <div className="text-left">
                        <strong>Sub Total:</strong> {subTotal.unitCost.toLocaleString()}
                    </div>
                    <div className="text-right">
                        {subTotal.unitPrice.toLocaleString()}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RecordsPage;
