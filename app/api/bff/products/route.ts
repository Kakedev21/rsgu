import ProductController from "@/controller/Product";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import { ProductProps } from "@/types/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json() as ProductProps;
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
       
        const product = await ProductController.create(body);
        return NextResponse.json({product});

    } catch (e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}

export async function GET(req: NextRequest) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const searchParams = req.nextUrl.searchParams;
        const page = Number(searchParams.get("page"));
        const limit = Number(searchParams.get("limit"));
        const search = searchParams.get("q") as string;
        const category = searchParams.get("category") as string
     
        const products = await ProductController.products(req, {page, limit, q: search, category});
        return NextResponse.json({
            products
        });
    } catch(e) {
        return NextResponse.json({
            error: e
        })
    }
}