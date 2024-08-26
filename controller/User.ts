import { NextRequest } from 'next/server';

import { UserProps } from "@/types/User";
import { connectMongoDB } from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/authOptions';

const UserController = {
    users: async (req: NextRequest, {page, limit, q}: {page: number, limit: number, q?: string}) => {
        await connectMongoDB();
        const regex = new RegExp(q as string, 'i');
        const session =  await getServerSession(authOptions);
        const  filter = {
            ...(q ? {
                $or: [
                    {
                        name: {$regex: regex}
                    },
                    {
                        email: {$regex: regex}
                    },
                    {
                        username: {$regex: regex}
                    }
                ]
            } : {})
        };
    
        const [users, count] = await Promise.all([
            await User.find(
                {
                    $and: [
                        { role: { $ne: "root" }},
                        { username: { $ne: session?.user?.username }},
                        {
                            ...filter
                        }
                    ]
                }
            )
            .skip((page - 1) * limit)
            .limit(limit),
            await User.countDocuments({
                $and: [
                    { role: { $ne: "root" }},
                    { username: { $ne: session?.user?.username }},
                    {
                        ...filter
                    }
                ]
            }).exec()
          ])
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
        const user = await User.create(payload) as UserProps;
        return user;

    },
    getUserDetails: async (user_id: string) => {
        await connectMongoDB();
        const user = await User.findOne({_id: user_id}).exec()
        return user;
    },
    updateUserDetails: async (user_id: string, data: UserProps) => {
        await connectMongoDB();
        const user = await User.findOneAndUpdate({_id: user_id}, {...data}, { new: true, upsert: true, runValidators: true});
        return user;
    },
    deleteUser: async (user_id: string) => {
        await connectMongoDB();
        const user = await User.deleteOne(({_id: user_id}));
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
                  // Format the `createdAt` date to the desired format (e.g., 'YYYY-MM-DD')
                  date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                }
            },
            {
              $group: {
                _id: "$date", // Group by department
                count: { $sum: 1 }  // Count the number of users in each department
              }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        return results;
    },
    
}

export default UserController;