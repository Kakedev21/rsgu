"use client";

import SearchInput from "@/components/SearchInput";
import ItemDetail from "./ItemDetail";
import ReceiptPreview from "./ReceiptPreview";
import TotalPayment from "./TotalPayment";
import PaymentCTA from "./PaymentCTA";

const Cashier = () => {

    return (
        <div className="w-full bg-white p-5 rounded-lg shadow-md space-y-5">
            <div className="flex justify-between items-center gap-5">
                <div className=" w-2/3">
                    <p className="font-semibold">Cashier</p>
                </div>
                <div>

                </div>
                <SearchInput autoFocus data-autofocus/>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <SearchInput/>
                </div>
                <div className="space-y-5">
                    <ItemDetail/>
                    <TotalPayment/>

                </div>
                <div className="space-y-5">
                    <ReceiptPreview/>
                </div>
            </div>
            <div className="flex justify-end">
                <PaymentCTA/>
            </div>
            
        </div>
    )
}


export default Cashier;