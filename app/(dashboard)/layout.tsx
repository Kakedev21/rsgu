

import { User } from './user';

import Providers from './providers';

import DesktopNav from '@/components/navigation/DesktopNav';
import MobileNav from '@/components/navigation/MobileNav';
import BreadCrumbNav from '@/components/navigation/BreadCrumb';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4  sm:pl-20">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 py-4 border-b bg-red-500 px-4 sm:static sm:h-auto sm:border-0 sm:px-6 shadow-lg">
            <MobileNav />
            <BreadCrumbNav />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 p-5 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
  
      </main>
    </Providers>
  );
}

