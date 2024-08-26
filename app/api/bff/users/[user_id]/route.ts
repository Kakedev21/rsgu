import { UserProps } from '@/types/User';
import { has } from 'lodash';
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import UserController from '@/controller/User';


export async function GET(req: NextRequest, { params }: { params: { user_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const user = await UserController.getUserDetails(params.user_id) as UserProps;
        return NextResponse.json({
            user
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}


export async function PUT(req: NextRequest, { params }: { params: { user_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        let payload = await req.json() as UserProps;
       
        if (has(payload, "password")) {
            payload = {
                ...payload,
                password: await bcrypt.hash(payload.password as string, 10)
            }
        }
        const user = await UserController.updateUserDetails(params.user_id, payload);
        return NextResponse.json({
            user
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { user_id: string } }) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        const user = await UserController.deleteUser(params.user_id);
        return NextResponse.json({
            user
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}