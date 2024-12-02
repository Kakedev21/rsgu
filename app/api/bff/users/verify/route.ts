import { NextRequest, NextResponse } from 'next/server';
import UserController from '@/controller/User';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;
    const data = await UserController.verifyEmail(token);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
