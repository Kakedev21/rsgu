
import { connectMongoDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcrypt";
export async function POST(req: NextRequest) {
    try {
        const { credentials, name, email, password } =  await req?.json();
        const user = await User.findOne({name: name});
        console.log("user", user.name, user.password)
        const hashedPassword = await bcrypt.hash(password, 10);
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        console.log(credentials, hashedPassword, isPasswordCorrect)
        await connectMongoDB();
        await User.create({
            name,
            email,
            password: hashedPassword
        })
        return NextResponse.json({credentials});

    } catch(e) {
        return NextResponse.json({
            error: e
        })
    }
}