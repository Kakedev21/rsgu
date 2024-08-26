import type { Metadata } from "next";

import './globals.css';
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "./Providers";
import { Toaster } from "@/components/ui/toaster";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const metadata: Metadata = {
  title: 'Batangas State University - RGO',
  description: ''
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(
          "flex min-h-screen w-full flex-col bg-background font-sans antialiased",
          fontSans.variable
        )}>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster/>
      </body>
 
    </html>
  );
}
