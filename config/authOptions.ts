
import { connectMongoDB } from "@/lib/mongodb";
import { Account, NextAuthOptions } from "next-auth";
import { JWT } from 'next-auth/jwt';
import { get, pick } from 'lodash';
import CryptoJS from 'crypto-js';
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import User from "@/models/User";
interface UserProps {
    _id?: string;
    id?: string;
    email?: string | null | undefined;
    name?: string  | null | undefined;
    role: string;
    profilePicture?: string;
    password?: string | undefined;
    username: string;
    department: string;
}
export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {},
            async authorize(credentials, req) {
                const payload = req.body?.payload;
                const bytesCredentials = CryptoJS.AES.decrypt(payload, process.env.AUTH_SECRET as string);
                
                const requestPayload = JSON.parse(bytesCredentials.toString(CryptoJS.enc.Utf8) || "{}");
                await connectMongoDB();
                const user: UserProps = await User.findOne({username: requestPayload?.username}) as UserProps;
                const isPasswordCorrect = await bcrypt.compare(requestPayload?.password, user.password as string);
                if (isPasswordCorrect) {
                    return {
                        ...pick(user, ["name", "email", "username", "department"]),
                        id: user?.["_id"] as string,
                        role: user.role as string,
                        profilePicture: user.profilePicture,
                        session_id: user?._id as string
                    };
                }
                return null
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60 * 30 / 1000
    },
    jwt: {
        maxAge: 1 * 24 * 60 * 60 * 30 / 1000,
    },
    callbacks: {
        async jwt({token, user} : {token: JWT, user: UserProps, account: Account | null}) {
            
          if (user) {
            return {
                ...token,
                username: user.username,
                role: user.role,
                session_id: user?.id as string,
                department: user.department
            }
          }
          return token;
        },
        async session(props) {
            const { session, token } = props;
           console.log("token", token)
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token?.username,
                    role: token.role,
                    session_id: token?.session_id,
                    department: token.department
                }
            }

        }
      },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login"
    }
}
