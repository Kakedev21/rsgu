"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PendingOrders from "./PendingOrders";
import PaidOrders from "./PaidOrders";
import CompleteOrders from "./CompleteOrders";
import { useSearchParams } from "next/navigation";

const OrdersLists = () => {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'pending';

    return (
        <div className="w-full bg-white p-5 space-y-5">
            <p className="font-semibold text-xl">Orders List</p>
            <Tabs defaultValue={tab} className="w-full">
                <TabsList>
                    <TabsTrigger value="pending">Pre order</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="pending"><PendingOrders /></TabsContent>
                <TabsContent value="paid"><PaidOrders /></TabsContent>
                <TabsContent value="completed"><CompleteOrders /></TabsContent>
            </Tabs>
        </div>
    );
}

export default OrdersLists;