



import AxiosInterceptor from '@/components/axiosInterceptor';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/app/(route)/admin/(dashboard)/providers';
import User from '@/app/(route)/admin/(dashboard)/user';
import Image from 'next/image';
import CashierAuthProvider from './_components/CashierAuthProvider';
import UserProfile from '@/components/userProfile/Profile';

export default function CashierLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
        <CashierAuthProvider>
            <AxiosInterceptor/>
            <main className="flex min-h-screen w-full flex-col bg-muted/40">
                <div className="flex flex-col sm:gap-4">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 py-4 border-b bg-red-500 px-4 sm:static sm:h-auto sm:border-0 sm:px-6 shadow-lg rounded-b">
                    <div className='flex-1'>
                        <Image
                            src="/rgo_logo_1.png"
                            width={32}
                            height={32}
                            alt="logo"
                            className="block"
                        />
                    </div>
                    <User />
                    <UserProfile/>
                </header>
                <main className="grid flex-1 items-start gap-2 p-5 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
                    {children}
                </main>
                </div>
                <Toaster />
            </main>
        </CashierAuthProvider>
    </Providers>
  );
}

