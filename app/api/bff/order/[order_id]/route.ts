
import { NextRequest, NextResponse } from "next/server";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import { OrderProps } from "@/types/Order";
import OrderController from "@/controller/Order";



export async function GET(req: NextRequest, { params }: { params: { order_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const order = await OrderController.get(params.order_id) as OrderProps;
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


export async function PUT(req: NextRequest, { params }: { params: { order_id: string } }) {
    try {
       
        const payload = await req.json() as OrderProps;
        const order = await OrderController.update(params.order_id, payload);
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

export async function DELETE(req: NextRequest, { params }: { params: { order_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const order = await OrderController.delete(params.order_id);
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