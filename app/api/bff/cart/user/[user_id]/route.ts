
import { NextRequest, NextResponse } from "next/server";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import CartController from '@/controller/Cart';



export async function DELETE(req: NextRequest, { params }: { params: { user_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const cart = await CartController.clearCart(params.user_id);
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