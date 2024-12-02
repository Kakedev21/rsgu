import { connectMongoDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/tokenValidator';
import { pick } from 'lodash';
import CryptoJS from 'crypto-js';
import bcrypt from 'bcrypt';
import User from '@/models/User';
export async function POST(req: NextRequest) {
  try {
    const { payload } = await req?.json();
    const bytesCredentials = CryptoJS.AES.decrypt(
      payload,
      process.env.AUTH_SECRET as string
    );
    const requestPayload = JSON.parse(
      bytesCredentials.toString(CryptoJS.enc.Utf8) || '{}'
    );
    const { username, password } = requestPayload;
    await connectMongoDB();
    const user = await User.findOne({ username: username });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user?.password);
      if (isPasswordCorrect) {
        const token = generateToken(
          pick(user, ['_id', 'name', 'username', 'email', 'role', 'department'])
        );
        return NextResponse.json({ user, access_token: token });
      }
    }
    return NextResponse.json({
      status: 401
    });
  } catch (e) {
    console.log('e', e);
    return NextResponse.json({
      error: e,
      status: 401
    });
  }
}
