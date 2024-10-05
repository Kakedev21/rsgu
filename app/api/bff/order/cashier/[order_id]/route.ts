import { NextRequest, NextResponse } from "next/server";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import { OrderProps } from "@/types/Order";
import OrderController from "@/controller/Order";



export async function GET(req: NextRequest, { params }: { params: { order_id: string } }) {
    try {
       
        const order = await OrderController.cashier.getOrder(params.order_id as string) as OrderProps;
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