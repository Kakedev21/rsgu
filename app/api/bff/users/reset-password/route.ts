import UserController from '@/controller/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, currentPassword, newPassword } = body;
    const data = await UserController.resetPassword(
      token,
      currentPassword,
      newPassword
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
