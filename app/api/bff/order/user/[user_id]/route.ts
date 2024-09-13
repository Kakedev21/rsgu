
import { NextRequest, NextResponse } from "next/server";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import { OrderProps } from "@/types/Order";
import OrderController from "@/controller/Order";



export async function GET(req: NextRequest, { params }: { params: { user_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const searchParams = req.nextUrl.searchParams;
        const page = Number(searchParams.get("page"));
        const limit = Number(searchParams.get("limit"));
        const search = searchParams.get("q") as string;
        const order = await OrderController.userOrders({user_id: params.user_id, limit, page, q: search as string});
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
