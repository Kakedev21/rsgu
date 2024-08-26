import CryptoJS from 'crypto-js';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const payload = await req.json();
    const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), process.env.AUTH_SECRET as string).toString()
    
    return NextResponse.json({
        payload: encryptedPayload
    })
}