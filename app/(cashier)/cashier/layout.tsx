



import AxiosInterceptor from '@/components/axiosInterceptor';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/app/(route)/admin/(dashboard)/providers';
import User from '@/app/(route)/admin/(dashboard)/user';
import Image from 'next/image';
import CashierAuthProvider from './_components/CashierAuthProvider';
import UserProfile from '@/components/userProfile/Profile';
import { ClipboardList, UserPlus, Users } from 'lucide-react';
import Transactions from './_components/Transactions';
import CashierUserDrawer from './_components/CashierUserDrawer';
import CashierUserTable from './_components/CashierUserTable';

export default function CashierLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <CashierAuthProvider>
        <AxiosInterceptor />
        <main className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 py-4 border-b bg-red-500 px-4 sm:static sm:h-auto sm:border-0 sm:px-6 shadow-lg rounded-b">
              <div className='flex-1 flex items-center gap-5'>
                <Image
                  src="/rgo_logo.png"
                  width={60}
                  height={60}
                  alt="logo"
                  className="block"
                />
                <div className="space-y-0">
                  <p className="text-xs sm:text-lg text-slate-100 font-semibold py-3 sm:p-0 m-0 flex flex-col">
                    Batangas State University
                    <span className="text-[8px] sm:text-xs text-slate-100">Leading Innovations, Transforming Lives</span>
                  </p>

                </div>
              </div>
              <div className='flex gap-5 items-center'>
                <CashierUserTable
                  trigger={<Users className='text-slate-50 cursor-pointer' />}
                />
              </div>
              <div className='flex gap-5 items-center'>
                <CashierUserDrawer
                  trigger={<UserPlus className='text-slate-50 cursor-pointer' />}
                />
              </div>
              <div className='flex gap-5 items-center'>
                <Transactions
                  trigger={<ClipboardList className='text-slate-50 cursor-pointer' />}
                />
                <User />
              </div>

              <UserProfile />
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

