import { ProductProps } from '@/types/Product';

import { NextRequest, NextResponse } from "next/server";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import ProductController from '@/controller/Product';


export async function GET(req: NextRequest, { params }: { params: { product_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const product = await ProductController.get(params.product_id) as ProductProps;
        return NextResponse.json({
            product
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}


export async function PUT(req: NextRequest, { params }: { params: { product_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const payload = await req.json() as ProductProps;
        const product = await ProductController.update(params.product_id, payload);
        return NextResponse.json({
            product
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { product_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const product = await ProductController.delete(params.product_id);
        return NextResponse.json({
            product
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}