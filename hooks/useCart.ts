
import axios from "axios";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { CartProps } from "@/types/Cart";

export interface UseCartStateProps {
    selected: CartProps | null,
    openDeleteDialog: boolean;
    openFormDialog: boolean;
    setOpenFormDialog: (value: boolean) => void;
    setOpenDeleteDialog: (value: boolean) => void;
    setSelected: (cart: CartProps | null) => void;
    updateCart: boolean;
    setUpdateCart: (update: boolean) => void;

}

export const useCartState = create<UseCartStateProps>(set => ({
    selected: null,
    openDeleteDialog: false,
    openFormDialog: false,
    updateCart: false,
    setOpenProfile: (value: boolean) => set(state => ({...state, openProfile: value})),
    setOpenFormDialog: (value: boolean) => set(state => ({...state, openFormDialog: value})),
    setOpenDeleteDialog: (value: boolean) => set(state => ({...state, openDeleteDialog: value})),
    setSelected: (cart: CartProps | null) => set(state => ({...state, selected: cart})),
    setUpdateCart: (value: boolean) => set(state => ({...state, updateCart: value}))
}))

const useCart = ({page = 1, limit = 10, init = false, q = ""}: {page?: number, limit?: number, init?:boolean, q?: string}) => {
    const [cart, setCart] = useState<{cart: CartProps[], page: number, limit: number, count: number} | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const getAllCart = async (page: number, limit: number, q?: string | null) => {
        setLoading(true);
        const result = await axios.get(`/api/bff/cart`, {
            params: {
                page,
                limit,
                ...( q ? { q: q } : {})
            }
        });
        setLoading(false);
        if (result.data.cart) {
            setCart(result.data.cart)
        }
    }

    const create = async (payload: CartProps[]) => {
        setLoading(true);
        const result = await axios.post('/api/bff/cart', payload);
        setLoading(false);
        return result.data;
    }

    const update = async (payload: CartProps, cart_id: string) => {
        setLoading(true);
        const result = await axios.put(`/api/bff/cart/${cart_id}`, payload);
        setLoading(false);
        return result.data;
    }

    const deleteCategory = async (cart_id: string) => {
        setLoading(true)
        const result = await axios.delete(`/api/bff/cart/${cart_id}`);
        setLoading(false)
        return result.data;
    }
   
    useEffect(() => {
       
        if (!cart && !loading && init) {
            setTimeout(() => {
                getAllCart(page, limit)
            }, 300)
        }
    }, [init])



    return {
        cart,
        getAllCart,
        loading,
        create,
        update,
        deleteCategory
    }
}
 
export default useCart;