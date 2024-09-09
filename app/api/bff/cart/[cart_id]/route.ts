
import { NextRequest, NextResponse } from "next/server";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import { CartProps } from '@/types/Cart';
import CartController from '@/controller/Cart';


export async function GET(req: NextRequest, { params }: { params: { cart_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const cart = await CartController.get(params.cart_id) as CartProps;
        return NextResponse.json({
            cart
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}


export async function PUT(req: NextRequest, { params }: { params: { cart_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const payload = await req.json() as CartProps;
        const cart = await CartController.update(params.cart_id, payload);
        return NextResponse.json({
            cart
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { cart_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const cart = await CartController.delete(params.cart_id);
        return NextResponse.json({
            cart
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}