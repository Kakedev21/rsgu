"use client"
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, UserCog } from 'lucide-react';
import { redirect } from 'next/navigation';

const User = () => {

  const session = useSession();
  const handleSignOut = () => {
      signOut();
      redirect('/');
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarFallback>{session.data?.user?.name?.split(" ").map((n)=>n[0]).join("")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2">
          <UserCog size={16}/>
          <p>Profile</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2" onClick={handleSignOut}>
            <LogOut size={16}/>
            <p>Sign Out</p>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default User;
