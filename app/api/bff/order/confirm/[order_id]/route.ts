
import OrderController from "@/controller/Order";
import { OrderProps } from "@/types/Order";




import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { order_id: string } }) {
    try {
       
        const payload = await req.json() as OrderProps;
        const order = await OrderController.updateStatus(params.order_id, payload);
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