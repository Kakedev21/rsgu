
import axios from "axios";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { OrderFormValues, OrderProps } from "@/types/Order";

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

const useOrder = ({page = 1, limit = 10, init = false, q = "", user_id = ""}: {page?: number, limit?: number, init?:boolean, q?: string, user_id?: string}) => {
    const [orders, setOrders] = useState<{orders: OrderProps[], page: number, limit: number, count: number} | null>(null)
    const [order, setOrder] = useState<OrderProps[] | null>();
    const [transactions, setTransactions] = useState<any[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getAllOrder = async ({page, limit, q, user_id}:{page: number, limit: number, q?: string | null, user_id?: string}) => {
        setLoading(true);
        const apiUrl = user_id ? `/api/bff/order/user/${user_id}` : `/api/bff/order`;
        const result = await axios.get(apiUrl, {
            params: {
                page,
                limit,
                ...( q ? { q: q } : {})
            }
        });
        setLoading(false);
        if (result.data.order) {
            setOrders(result.data.order)
            return result.data.order;
        }
    }

    const create = async (payload: OrderFormValues[] | {status: string}) => {
        setLoading(true);
        const result = await axios.post('/api/bff/order', payload);
        setLoading(false);
        return result.data;
    }

    const update = async (payload: OrderFormValues[], order_id: string) => {
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

    const orderDetail = async (order_id: string) => {
        setLoading(true)
        const result = await axios.get(`/api/bff/order/cashier/${order_id}`);
        setLoading(false)
        setOrder(result.data?.order)
        return result.data;
    }

    const confirmOrder = async (payload: {status: string, cashier: string}, order_id: string) => {
        setLoading(true);
        const result = await axios.put(`/api/bff/order/${order_id}`, payload);
        setLoading(false);
        return result.data;
    }

    const getTransactions = async (cashier_id: string) => {
        setLoading(true);
        const result = await axios.get(`/api/bff/order/cashier/transactions/${cashier_id}`);
        setLoading(false);
        setTransactions(result.data?.order)
        return result.data?.order;
    }
   
    useEffect(() => {
       
        if (!orders && !loading && init) {
            setTimeout(() => {
                getAllOrder({page, limit, user_id})
            }, 300)
        }
    }, [init, user_id])



    return {
        orders,
        getAllOrder,
        loading,
        create,
        update,
        deleteOrder,
        orderDetail,
        order,
        confirmOrder,
        setOrder,
        getTransactions,
        transactions
    }
}
 
export default useOrder;