
import axios from "axios";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { OrderProps } from "@/types/Order";

export interface UseOrderStateProps {
    selected: OrderProps | null,
    openDeleteDialog: boolean;
    openFormDialog: boolean;
    setOpenFormDialog: (value: boolean) => void;
    setOpenDeleteDialog: (value: boolean) => void;
    setSelected: (order: OrderProps | null) => void;

}

export const useOrderState = create<UseOrderStateProps>(set => ({
    selected: null,
    openDeleteDialog: false,
    openFormDialog: false,
    setOpenProfile: (value: boolean) => set(state => ({...state, openProfile: value})),
    setOpenFormDialog: (value: boolean) => set(state => ({...state, openFormDialog: value})),
    setOpenDeleteDialog: (value: boolean) => set(state => ({...state, openDeleteDialog: value})),
    setSelected: (order: OrderProps | null) => set(state => ({...state, selected: order})),
  
}))

const useOrder = ({page = 1, limit = 10, init = false, q = ""}: {page?: number, limit?: number, init?:boolean, q?: string}) => {
    const [orders, setOrders] = useState<{orders: OrderProps[], page: number, limit: number, count: number} | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const getAllOrder = async (page: number, limit: number, q?: string | null) => {
        setLoading(true);
        const result = await axios.get(`/api/bff/order`, {
            params: {
                page,
                limit,
                ...( q ? { q: q } : {})
            }
        });
        setLoading(false);
        if (result.data.orders) {
            setOrders(result.data.orders)
            return result.data.orders;
        }
    }

    const create = async (payload: OrderProps[]) => {
        setLoading(true);
        const result = await axios.post('/api/bff/order', payload);
        setLoading(false);
        return result.data;
    }

    const update = async (payload: OrderProps, order_id: string) => {
        setLoading(true);
        const result = await axios.put(`/api/bff/order/${order_id}`, payload);
        setLoading(false);
        return result.data;
    }

    const deleteOrder = async (order_id: string) => {
        setLoading(true)
        const result = await axios.delete(`/api/bff/order/${order_id}`);
        setLoading(false)
        return result.data;
    }
   
    useEffect(() => {
       
        if (!orders && !loading && init) {
            setTimeout(() => {
                getAllOrder(page, limit)
            }, 300)
        }
    }, [init])



    return {
        orders,
        getAllOrder,
        loading,
        create,
        update,
        deleteOrder
    }
}
 
export default useOrder;