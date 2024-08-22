'use client'

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
export const AuthProvider = ({children}: {
    children: ReactNode
}) => {
    return <SessionProvider >
        {children}
    </SessionProvider>
} 