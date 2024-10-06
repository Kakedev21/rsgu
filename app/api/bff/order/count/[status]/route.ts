
import OrderController from "@/controller/Order";



import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,  { params }: { params: { status: string } }) {
    try {
      
    
        const orders = await OrderController.orderStatus({status: params.status});
        return NextResponse.json({
            orders
        });
    } catch(e) {
        return NextResponse.json({
            error: e
        })
    }
}