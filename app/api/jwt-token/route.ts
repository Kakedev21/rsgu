import { pick } from 'lodash';
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { generateToken } from "@/lib/tokenValidator";

export async function GET(req: NextRequest) {
 
    const tokenClaims = await getToken({ req, secret: process.env.NEXTAUTH_SECRET as string })
    const token = generateToken(pick(tokenClaims, ["name", "email"]));
    console.log("JSON Web Token", token)
    return NextResponse.json({token});
}