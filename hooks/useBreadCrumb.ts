import { create } from "zustand";



type BreadCrumbData = {
    label: string;
    href: string;
    isActive?: boolean;
    id: string
    icon?: React.ReactNode,
    index?: boolean
}
type UseBreadCrumb = {
    breadcrumb: BreadCrumbData[],
    routes: BreadCrumbData[]
    setBreadCrumb: (data: BreadCrumbData[]) => void,
    setRoutes: (routes: BreadCrumbData[]) => void
}
const useBreadCrumb = create<UseBreadCrumb>(set => ({
    breadcrumb: [],
    routes: [],
    setBreadCrumb: (data: BreadCrumbData[]) => set(() => ({breadcrumb: data})),
    setRoutes: (routes: BreadCrumbData[]) => set((state) => ({...state, routes: routes}))
}))
 
export default useBreadCrumb;