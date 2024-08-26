import UserController from "@/controller/User";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        if (!RequestHeaderValidator.authenticate(req)) {
            return NextResponse.json({status: 401})
        }
        
        const users = await UserController.totalUsers();
        return NextResponse.json({
            users
        });
    } catch(e) {
        console.log("e", e)
        return NextResponse.json({
            error: e
        })
    }
}