
import axios from "axios";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { ProductProps } from "@/types/Product";

interface UseProductStateProps {
    selected: ProductProps | null,
    openDeleteDialog: boolean;
    openFormDialog: boolean;
    setOpenFormDialog: (value: boolean) => void;
    setOpenDeleteDialog: (value: boolean) => void;
    setSelected: (category: ProductProps | null) => void;

}

export const useProductState = create<UseProductStateProps>(set => ({
    selected: null,
    openDeleteDialog: false,
    openFormDialog: false,
    setOpenFormDialog: (value: boolean) => set(state => ({...state, openFormDialog: value})),
    setOpenDeleteDialog: (value: boolean) => set(state => ({...state, openDeleteDialog: value})),
    setSelected: (product: ProductProps | null) => set(state => ({...state, selected: product}))
}))

const useProduct = ({page = 1, limit = 10, init = false}: {page?: number, limit?: number, init?:boolean}) => {
    const [products, setProducts] = useState<{products: ProductProps[], page: number, limit: number, count: number} | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const getAll = async (page: number, limit: number, q?: string | null) => {
        setLoading(true);
        const result = await axios.get(`/api/bff/products`, {
            params: {
                page,
                limit,
                ...( q ? { q: q } : {})
            }
        });
        setLoading(false);
        if (result.data.products) {
            setProducts(result.data.products)
        }
    }

    const create = async (payload: ProductProps) => {
        setLoading(true);
        const result = await axios.post('/api/bff/products', payload);
        setLoading(false);
        return result.data;
    }

    const update = async (payload: ProductProps, product_id: string) => {
        const result = await axios.put(`/api/bff/products/${product_id}`, payload);
        return result.data;
    }

    const deleteProduct = async (product_id: string) => {
        setLoading(true)
        const result = await axios.delete(`/api/bff/products/${product_id}`);
        setLoading(false)
        return result.data;
    }
   
    useEffect(() => {
       
        if (!products && !loading && init) {
            setTimeout(() => {
                getAll(page, limit)
            }, 300)
        }
    }, [init])



    return {
        products,
        getAll,
        loading,
        create,
        update,
        deleteProduct
    }
}
 
export default useProduct;