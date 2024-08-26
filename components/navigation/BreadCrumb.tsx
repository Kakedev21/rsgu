"use client"

import Image from "next/image";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import useBreadCrumb from "@/hooks/useBreadCrumb";
import { Skeleton } from "../ui/skeleton";
import { times } from "lodash";

const BreadCrumbNav = () => {
  const pathname = usePathname();
  const breadCrumbState = useBreadCrumb();
  const router = useRouter();
  const breadCrumb = useMemo(() => {

      return pathname.split("/").filter(path => !!path)
      ?.map(path => {
          const currentRoute = breadCrumbState.routes.find(route => route.id === path)
          return {
              ...currentRoute,
              ...(currentRoute ? {  isActive: currentRoute?.href === pathname } : {})
          }
      }) || []
      
  }, [breadCrumbState?.routes, pathname]);
    return (
        <div className='flex gap-3 flex-1'>
          <Image
            src="/rgo_logo_1.png"
            width={32}
            height={32}
            alt="logo"
            className="block"
          />
          <Breadcrumb className="hidden md:flex ">
            <BreadcrumbList>
            {
                    !breadCrumbState?.routes?.length && times(3).map(count => (
                        <BreadcrumbItem key={count}>
                            <Skeleton className="w-[100px] h-[20px]" />
                        </BreadcrumbItem>
                    ))
                }
                {
                    !!breadCrumb?.length && breadCrumb.map((path, index) => (
                        <div key={`${index}+${path.id}`} className="flex gap-1 items-center">
                            <BreadcrumbItem key={path.id}>
                                {!path.isActive && <BreadcrumbLink asChild className="text-neutral-300 hover:text-neutral-100">
                                    <span onClick={() => router.push(path.href || "")} className="cursor-pointer ">{path.label}</span>
                                </BreadcrumbLink>}
                                {path.isActive && <BreadcrumbPage className="text-neutral-50">{path.label}</BreadcrumbPage>}
                            </BreadcrumbItem>
                            {breadCrumb && breadCrumb.length > 1 && (index + 1 < breadCrumb.length) && <BreadcrumbSeparator />}
                        </div>
                    ))
                }
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      );
}


export default BreadCrumbNav;