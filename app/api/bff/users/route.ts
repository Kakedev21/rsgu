import UserController from "@/controller/User";
import RequestHeaderValidator from "@/lib/requestHeaderValidator";
import { UserProps } from "@/types/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json() as UserProps;
        if (!RequestHeaderValidator.authenticate(req) && body.role !== "user") {
            return NextResponse.json({status: 401})
        }
       
        const user = await UserController.createUser(body);
        return NextResponse.json({user});

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
     
        const users = await UserController.users(req, {page, limit, q: search});
        return NextResponse.json({
            users
        });
    } catch(e) {
        return NextResponse.json({
            error: e
        })
    }
}