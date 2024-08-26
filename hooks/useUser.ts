
import axios from "axios";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { UserProps } from "@/types/User";

interface UseUserStateProps {
    selectedUser: UserProps | null,
    openDeleteDialog: boolean;
    openFormDialog: boolean;
    openProfile: boolean;
    setOpenProfile: (value: boolean) => void;
    setOpenFormDialog: (value: boolean) => void;
    setOpenDeleteDialog: (value: boolean) => void;
    setSelectedUser: (student: UserProps | null) => void;

}

export const useUserState = create<UseUserStateProps>(set => ({
    selectedUser: null,
    openDeleteDialog: false,
    openFormDialog: false,
    openProfile: false,
    setOpenProfile: (value: boolean) => set(state => ({...state, openProfile: value})),
    setOpenFormDialog: (value: boolean) => set(state => ({...state, openFormDialog: value})),
    setOpenDeleteDialog: (value: boolean) => set(state => ({...state, openDeleteDialog: value})),
    setSelectedUser: (user: UserProps | null) => set(state => ({...state, selectedUser: user}))
}))

const useUser = (page: number = 1, limit: number = 10, init = true) => {
    const [users, setUsers] = useState<{users: UserProps[], page: number, limit: number, count: number} | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const getAllUser = async (page: number, limit: number, q?: string | null) => {
        setLoading(true);
        const result = await axios.get(`/api/bff/users`, {
            params: {
                page,
                limit,
                ...( q ? { q: q } : {})
            }
        });
        setLoading(false);
        if (result.data.users) {
            setUsers(result.data.users)
        }
    }

    const createUser = async (payload: UserProps) => {
        const result = await axios.post('/api/bff/users', payload);
        return result.data;
    }

    const updateUser = async (payload: UserProps, user_id: string) => {
        const result = await axios.put(`/api/bff/users/${user_id}`, payload);
        return result.data;
    }

    const deleteUser = async (user_id: string) => {
        setLoading(true)
        const result = await axios.delete(`/api/bff/users/${user_id}`);
        setLoading(false)
        return result.data;
    }
    const getTotalUserCount = async () => {
        setLoading(true);
        const result = await axios.get('/api/bff/users/dashboard');
        setLoading(false);
        return result?.data;
    }
    const chart = async () => {
        setLoading(true);
        const result = await axios.get('/api/bff/users/chart');
        setLoading(false);
        return result?.data;
    }
    useEffect(() => {
        if (!users && !loading && init) {
            getAllUser(page, limit)
        }
    }, [init])



    return {
        users,
        getAllUser,
        loading,
        createUser,
        updateUser,
        deleteUser,
        getTotalUserCount,
        chart
    }
}
 
export default useUser;