import CategoryController from "@/controller/Category";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import { CategoryProps } from "@/types/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json() as CategoryProps;
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
       
        const category = await CategoryController.create(body);
        return NextResponse.json({category});

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
     
        const categories = await CategoryController.categories(req, {page, limit, q: search});
        return NextResponse.json({
            categories
        });
    } catch(e) {
        return NextResponse.json({
            error: e
        })
    }
}