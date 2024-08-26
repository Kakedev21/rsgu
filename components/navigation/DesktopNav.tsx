"use client"

import { NavItem } from "./nav-item";
import { Boxes, CalendarRange, FilePieChart, Home, LayoutDashboard, LineChart, Package, Settings, ShoppingCart, UserCog, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react"
import { has } from "lodash";
import { useRouter } from "next/navigation";
import useBreadCrumb from "@/hooks/useBreadCrumb";
export const routeLists = [
    {
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5 hover:text-red-500 transition-all duration-300" />,
        href: "/admin",
        id: "admin",
        index: true
    },
    {
        label: "Products",
        icon:  <Package className="h-5 w-5 hover:text-red-500 transition-all duration-300" />,
        href: "/admin/products",
        id: "products"
    },
    {
        label: "Orders",
        icon: <ShoppingCart className="h-5 w-5 hover:text-red-500 transition-all duration-300" />,
        href: "/admin/orders",
        id: "orders"
    },
    {
        label: "Calendar",
        icon: <CalendarRange className="h-5 w-5 hover:text-red-500 transition-all duration-300"/>,
        href: "/admin/calendar",
        id: "calendar"
    },
    {
      label: "Inventory",
      icon: <Boxes className="h-5 w-5 hover:text-red-500 transition-all duration-300"/>,
      href: "/admin/inventory",
      id: "inventory"
    },
    {
        label: "Records",
        icon: <FilePieChart className="h-5 w-5 hover:text-red-500 transition-all duration-300"/>,
        href: "/admin/records",
        id: "records"
    },
    {
      label: "Users",
      icon: <UserCog className="h-5 w-5 hover:text-red-500 transition-all duration-300"/>,
      href: "/admin/users",
      id: "users",
    },
    
  ]
const DesktopNav = () => {
    const session = useSession();
    const router = useRouter();
    const breadCrumbState = useBreadCrumb();
    const routes = useMemo(() => {
        return routeLists.filter(route => {
        if (has(route, "role")) {
            return route.role === session?.data?.user.role;
        }
        return route;
        });
      
      }, [session.data?.user]);
      
    useEffect(() => {
        breadCrumbState.setRoutes(routes);
    }, [routes]);
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              href="/"
              className="mb-10 group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Image
                src="/rgo_logo.png"
                width={40}
                height={40}
                alt="logo"
                className="block"
              />
            </Link>
            {
                routes?.map(route => (
                    <NavItem href={route?.href} onClick={() => {
                        router.push(route?.href);
                    }} label={route?.label} key={route.id}>
                        {route?.icon}
                    </NavItem>
                ))
            }
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5 hover:text-red-500 transition-all duration-300" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav>
        </aside>
      );
}

export default DesktopNav;