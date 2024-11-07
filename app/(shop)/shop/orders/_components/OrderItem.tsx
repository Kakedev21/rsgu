
import { OrderProps } from "@/types/Order";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import OrderProducts from "./OrderProducts";
import numeral from "numeral";
import moment from "moment";
import Barcode from "react-barcode";
import { ScanLine, Printer } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const OrderItem: FC<OrderProps> = ({ _id, status, totalAmount, productId, createdAt }) => {

    const statusColor: any = {
        Completed: 'text-green-500',
        Pending: 'text-amber-500'
    }

    const handlePrint = () => {
        const printContent = document.getElementById(`order-receipt-${_id}`);
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Order Receipt</title>');
                printWindow.document.write(`
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: #f4f4f4;
                        }
                        .receipt-container {
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            width: 100%;
                            max-width: 600px;
                        }
                        .receipt-header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .receipt-header h1 {
                            margin: 0;
                            font-size: 24px;
                            color: #333;
                        }
                        .receipt-details {
                            margin-bottom: 20px;
                        }
                        .receipt-details p {
                            margin: 5px 0;
                            font-size: 14px;
                            color: #555;
                        }
                        .receipt-footer {
                            text-align: center;
                            font-size: 12px;
                            color: #aaa;
                        }
                    </style>
                `);
                printWindow.document.write('</head><body>');
                printWindow.document.write('<div class="receipt-container">');
                printWindow.document.write('<div class="receipt-header"><h1>Order Receipt</h1></div>');
                printWindow.document.write('<div class="receipt-details">');
                printWindow.document.write('<div style="display: flex; justify-content: center; align-items: center;">' + printContent.innerHTML + '</div>');
                printWindow.document.write('</div>');
                printWindow.document.write('<div class="receipt-footer">Thank you for your purchase!</div>');
                printWindow.document.write('</div>');
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
        <div className="border border-slate-50 bg-white p-5 rounded shadow">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex gap-2 items-center">
                        <Popover>
                            <PopoverTrigger><ScanLine /></PopoverTrigger>
                            <PopoverContent className="w-full">
                                <Barcode value={_id?.slice(-8) as string} />
                            </PopoverContent>
                        </Popover>
                        <p className="text-sm">Order Number:</p>
                        <p className="font-semibold text-sm">
                            {_id?.slice(-8) as string}
                        </p>
                    </div>
                    <p className="text-xs text-slate-600">{moment(createdAt).format("lll")}</p>
                    <p className={twMerge("text-xs text-slate-600", statusColor?.[status])}>{status}</p>
                </div>
                <div>
                    <p className="font-bold text-slate-700">₱{numeral(totalAmount).format('0,0.00')}</p>
                </div>
                <button onClick={handlePrint} className="ml-4">
                    <Printer className="text-slate-500" size={20} />
                </button>
            </div>
            <div id={`order-receipt-${_id}`} className="space-y-2 mt-1">
                <div className="hidden">
                    <Barcode value={_id?.slice(-8) as string} />
                    <div>
                        <p>Status: {status}</p>
                        <p>Total Amount: ₱{numeral(totalAmount).format('0,0.00')}</p>
                        <p>Ordered At: {moment(createdAt).format("lll")}</p>
                    </div>
                </div>
            </div>
            {
                productId?.map((product, index) => (
                    <OrderProducts key={`${product?._id}_${index}`} {...product} />
                ))
            }
        </div>
    );
}

export default OrderItem;