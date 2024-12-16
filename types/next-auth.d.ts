import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      subRole?: string;
      profilePicture?: string;
      username: string;
      session_id: string;
      department: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    subRole?: string;
    profilePicture?: string;
    username: string;
    session_id: string;
    department: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    subRole?: string;
    profilePicture?: string;
    username: string;
    session_id: string;
    department: string;
  }
}
