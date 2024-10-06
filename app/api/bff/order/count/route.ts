
import OrderController from "@/controller/Order";



import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get("status");
        const countType = searchParams.get("countType");
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const orders = countType === "daily" ? await OrderController.getTotalCountPerDayForMonth(Number(month), Number(year)) : await OrderController.getTotalCountPerMonth(status as string);
        return NextResponse.json({
            orders
        });
    } catch(e) {
        console.log(e)
        return NextResponse.json({
            error: e
        })
    }
}