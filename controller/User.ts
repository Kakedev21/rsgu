import { NextRequest } from 'next/server';
import crypto from 'crypto';
import emailjs from 'emailjs-com';
import { UserProps } from '@/types/User';
import { connectMongoDB } from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';
import { EmailTemplate } from '@/components/email-template';
import { EmailVerificationTemplate } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const UserController = {
  users: async (
    req: NextRequest,
    { page, limit, q }: { page: number; limit: number; q?: string }
  ) => {
    await connectMongoDB();
    const regex = new RegExp(q as string, 'i');
    const session = await getServerSession(authOptions);
    const filter = {
      ...(q
        ? {
            $or: [
              {
                name: { $regex: regex }
              },
              {
                email: { $regex: regex }
              },
              {
                username: { $regex: regex }
              }
            ]
          }
        : {})
    };

    const [users, count] = await Promise.all([
      await User.find({
        $and: [
          { role: { $ne: 'root' } },
          { username: { $ne: session?.user?.username } },
          {
            ...filter
          }
        ]
      })
        .skip((page - 1) * limit)
        .limit(limit),
      await User.countDocuments({
        $and: [
          { role: { $ne: 'root' } },
          { username: { $ne: session?.user?.username } },
          {
            ...filter
          }
        ]
      }).exec()
    ]);
    return {
      users,
      page,
      limit,
      count
    };
  },
  createUser: async (data: UserProps) => {
    const password = await bcrypt.hash(data.password as string, 10);
    const payload = {
      ...data,
      password: password
    };
    await connectMongoDB();
    console.log('payload', payload);
    const user = (await User.create(payload)) as UserProps;
    return user;
  },
  getUserDetails: async (user_id: string) => {
    await connectMongoDB();
    const user = await User.findOne({ _id: user_id }).exec();
    return user;
  },
  updateUserDetails: async (user_id: string, data: UserProps) => {
    await connectMongoDB();
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { ...data },
      { new: true, upsert: true, runValidators: true }
    );
    return user;
  },
  deleteUser: async (user_id: string) => {
    await connectMongoDB();
    const user = await User.deleteOne({ _id: user_id });
    return user;
  },
  totalUsers: async () => {
    await connectMongoDB();
    const count = await User.countDocuments();

    return count;
  },
  chart: async () => {
    await connectMongoDB();
    const results = await User.aggregate([
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
        }
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    return results;
  },

  forgotPassword: async (email: string) => {
    await connectMongoDB();
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const passwordLink = `https://rsgo.vercel.app/auth/forgotpassword?token=${token}`;
    return { passwordLink };
  },

  resetPassword: async (
    token: string,
    currentPassword: string,
    newPassword: string
  ) => {
    await connectMongoDB();
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    }).exec();

    if (!user) {
      throw new Error('Password reset token is invalid or has expired.');
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password as string
    );

    if (!isMatch) {
      return { message: 'Current password is incorrect.', status: 400 };
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return { message: 'Password reset successful.', status: 200 };
  },

  emailVerification: async (email: string) => {
    await connectMongoDB();
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      return { message: 'Email is already verified.', status: 200 };
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.verificationToken = token;

    await user.save();

    const emailVerification = `https://rsgo.vercel.app/auth/verifyemail?token=${token}`;
    return { emailVerification };
  },

  verifyEmail: async (token: string) => {
    await connectMongoDB();
    const user = await User.findOne({
      verificationToken: token
    }).exec();

    if (!user) {
      throw new Error('Verification token is invalid or has expired.');
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    return { message: 'Email verified successfully.', status: 200 };
  }
};

export default UserController;
