import { NextRequest, NextResponse } from "next/server";

import OrderController from "@/controller/Order";



export async function GET(req: NextRequest, { params }: { params: { cashier_id: string } }) {
    try {
       
        const order = await OrderController.cashier.transactions(params.cashier_id as string);
        return NextResponse.json({
            order
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}