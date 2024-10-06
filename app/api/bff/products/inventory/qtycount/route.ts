import ProductController from "@/controller/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
       
     
        const products = await ProductController.getAllProductsWithQty();
        return NextResponse.json({
            products
        });
    } catch(e) {
        return NextResponse.json({
            error: e
        })
    }
}