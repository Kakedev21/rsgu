import { CategoryProps } from '@/types/Product';
import { has } from 'lodash';
import { NextRequest, NextResponse } from "next/server";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import CategoryController from '@/controller/Category';


export async function GET(req: NextRequest, { params }: { params: { category_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const category = await CategoryController.get(params.category_id) as CategoryProps;
        return NextResponse.json({
            category
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}


export async function PUT(req: NextRequest, { params }: { params: { category_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const payload = await req.json() as CategoryProps;
        const category = await CategoryController.update(params.category_id, payload);
        return NextResponse.json({
            category
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { category_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const category = await CategoryController.delete(params.category_id);
        return NextResponse.json({
            category
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}