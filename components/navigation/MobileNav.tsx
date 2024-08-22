"use client"
import { PanelLeft, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { routeLists } from "./DesktopNav";

const MobileNav = () => {

    return (
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5 text-red-600" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full  text-lg font-semibold text-primary-foreground md:text-base"
              >
                  <Image
                    src="/rgo_logo.png"
                    width={40}
                    height={40}
                    alt="logo"
                  />
              </Link>
              {
                routeLists?.map(route => (
                    <p 
                        key={route?.id}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                        {route?.icon}
                        {route?.label}
                    </p>
                ))
              }
            
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      );
}


export default MobileNav;