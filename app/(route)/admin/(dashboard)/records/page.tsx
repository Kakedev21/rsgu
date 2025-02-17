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
import { Download, Calendar, List } from "lucide-react";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import LoadingOverlay from 'react-loading-overlay-ts';

interface ReportData {
    _id: string;
    productId: string | { name: string };
    beginningInventory?: {
        quantity: number;
        unitCost: number;
        unitPrice: number;
    };
    sales?: {
        quantity: number;
        unitCost: number;
        unitPrice: number;
    };
    endingInventory?: {
        quantity: number;
        unitCost: number;
        unitPrice: number;
    };
}

const RecordsPage = () => {
    const { reports, loading: reportLoading, getReportByDateRange, createDailyReport } = useReport();
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: new Date(),
        to: new Date()
    });
    const [subTotal, setSubTotal] = useState({ unitCost: 0, unitPrice: 0, sales: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState<ReportData[]>([]);

    const exportToExcel = () => {
        // Create worksheet data with headers
        const headers = [
            ['INVENTORY RECORDS REPORT'],
            ['Date Range:', dateRange.from?.toLocaleDateString(), 'to', dateRange.to?.toLocaleDateString()],
            [],
            ['ITEMS', 'UNIT COST (UC)', 'UNIT PRICE (UP)', 'BEGINNING INVENTORY', '', '', 'SALES', '', '', 'ENDING INVENTORY', '', ''],
            ['', '', '', 'QTY', 'UC', 'UP', 'QTY', 'UC', 'UP', 'QTY', 'UC', 'UP']
        ];

        // Add data rows
        const rows = reportData.map(record => [
            typeof record.productId === 'string'
                ? record.productId
                : record.productId && typeof record.productId === 'object' && 'name' in record.productId
                    ? record.productId.name
                    : 'N/A',
            record.beginningInventory?.unitCost || 0,
            record.beginningInventory?.unitPrice || 0,
            record.beginningInventory?.quantity || 0,
            record.beginningInventory?.unitCost || 0,
            record.beginningInventory?.unitPrice || '',
            record.sales?.quantity || '',
            record.sales?.unitCost || '',
            record.sales?.unitPrice || '',
            record.endingInventory?.quantity || '',
            record.endingInventory?.unitCost || '',
            record.endingInventory?.unitPrice || ''
        ]);

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

        // Generate filename with date range
        const fromDate = dateRange.from?.toISOString().split('T')[0];
        const toDate = dateRange.to?.toISOString().split('T')[0];
        const filename = `inventory_records_${fromDate}_to_${toDate}.xlsx`;

        // Save file
        XLSX.writeFile(wb, filename);
    };

    const handleGenerate = async () => {
        if (!dateRange.from || !dateRange.to) return;

        setIsLoading(true);
        try {
            createDailyReport()
            const result = await getReportByDateRange(dateRange.from, dateRange.to);
            setReportData(result);
            console.log("Generated reports:", result); // Debug log
        } catch (error) {
            console.error("Error generating report:", error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        let totalUnitCost = 0;
        let totalUnitPrice = 0;
        let totalSales = 0;

        if (reportData && reportData.length > 0) {
            reportData.forEach((record) => {
                totalUnitCost += (record.beginningInventory?.quantity || 0) * (record.beginningInventory?.unitCost || 0);
                totalUnitPrice += (record.endingInventory?.quantity || 0) * (record.endingInventory?.unitPrice || 0);
                totalSales += (record.sales?.quantity || 0) * (record.sales?.unitPrice || 0);
            });
        }

        setSubTotal({ unitCost: totalUnitCost, unitPrice: totalUnitPrice, sales: totalSales });
    }, [reportData]);

    useEffect(() => {
        const fetchRecords = async () => {
            if (!dateRange.from || !dateRange.to) return;

            try {
                setIsLoading(true);
                const result = await getReportByDateRange(dateRange.from, dateRange.to);
                setReportData(result);
                console.log("Fetched reports:", result); // Debug log
            } catch (error) {
                console.error('Error fetching records:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, [dateRange.from, dateRange.to]);

    return (
        <LoadingOverlay active={isLoading} spinner>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Inventory Records</h1>
                    <div className="flex items-center gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {dateRange.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "PPP")
                                        )
                                    ) : (
                                        "Select date range"
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange.from}
                                    selected={{
                                        from: dateRange.from,
                                        to: dateRange.to,
                                    }}
                                    onSelect={(range) => {
                                        setDateRange({ from: range?.from, to: range?.to });
                                    }}
                                    numberOfMonths={1}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button onClick={handleGenerate} className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            Generate Report
                        </Button>
                        <Button onClick={exportToExcel} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export to Excel
                        </Button>
                    </div>
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
                            {reportData && reportData.length > 0 ? (
                                reportData.map((record) => (
                                    <TableRow key={record._id} className="border border-gray-300">
                                        <TableCell className="text-center border border-gray-300">
                                            {typeof record.productId === 'string' ? record.productId : (record.productId as { name: string })?.name ?? 'N/A'}
                                        </TableCell>
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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex justify-between mt-4">
                        <div className="text-left">
                            <strong>Sub Total:</strong> {subTotal.unitCost.toLocaleString()}
                        </div>
                        <div className="text-center">
                            <strong>Sales Total:</strong> {subTotal.sales.toLocaleString()}
                        </div>
                        <div className="text-right">
                            {subTotal.unitPrice.toLocaleString()}
                        </div>
                    </div>
                </Card>
            </div>
        </LoadingOverlay>
    );
};

export default RecordsPage;
