import Image from "next/image";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import Link from "next/link";

const BreadCrumbNav = () => {

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
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className='text-neutral-300 hover:text-neutral-100'>Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='text-neutral-300 hover:text-neutral-100'/>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className='text-neutral-300 hover:text-neutral-100'>Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='text-neutral-300 hover:text-neutral-100'/>
              <BreadcrumbItem>
                <BreadcrumbPage className='text-neutral-50'>All Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      );
}


export default BreadCrumbNav;