import axios from 'axios';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { UserProps } from '@/types/User';

interface UseUserStateProps {
  selected: UserProps | null;
  openDeleteDialog: boolean;
  openFormDialog: boolean;
  openProfile: boolean;
  setOpenProfile: (value: boolean) => void;
  setOpenFormDialog: (value: boolean) => void;
  setOpenDeleteDialog: (value: boolean) => void;
  setSelected: (student: UserProps | null) => void;
  updatePassword: boolean;
  setUpdatePassword: (value: boolean) => void;
}

export const useUserState = create<UseUserStateProps>((set) => ({
  selected: null,
  openDeleteDialog: false,
  openFormDialog: false,
  openProfile: false,
  updatePassword: false,
  setOpenProfile: (value: boolean) =>
    set((state) => ({ ...state, openProfile: value })),
  setOpenFormDialog: (value: boolean) =>
    set((state) => ({ ...state, openFormDialog: value })),
  setOpenDeleteDialog: (value: boolean) =>
    set((state) => ({ ...state, openDeleteDialog: value })),
  setSelected: (user: UserProps | null) =>
    set((state) => ({ ...state, selected: user })),
  setUpdatePassword: (value: boolean) =>
    set((state) => ({ ...state, updatePassword: value }))
}));

export const sendForgotPassword = async (email: string) => {
  const result = await axios.post('/api/send', { email });
  return result.data;
};

const useUser = ({
  page = 1,
  limit = 10,
  init = false
}: {
  page?: number;
  limit?: number;
  init?: boolean;
}) => {
  const [users, setUsers] = useState<{
    users: UserProps[];
    page: number;
    limit: number;
    count: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const getAll = async (page: number, limit: number, q?: string | null) => {
    setLoading(true);
    const result = await axios.get(`/api/bff/users`, {
      params: {
        page,
        limit,
        ...(q ? { q: q } : {})
      }
    });
    setLoading(false);
    if (result.data.users) {
      setUsers(result.data.users);
    }
  };

  const create = async (payload: UserProps) => {
    setLoading(true);
    const result = await axios.post('/api/bff/users', payload);
    setLoading(false);
    return result.data;
  };

  const update = async (payload: UserProps, user_id: string) => {
    setLoading(true);
    const result = await axios.put(`/api/bff/users/${user_id}`, payload);
    setLoading(false);
    return result.data;
  };

  const resetPassword = async (
    currentPassword: string,
    newPassword: string,
    token: string
  ) => {
    setLoading(true);
    const result = await axios.post(`/api/bff/users/reset-password`, {
      token,
      currentPassword,
      newPassword
    });
    setLoading(false);
    return result.data;
  };

  const confirmEmail = async (token: string) => {
    setLoading(true);
    const result = await axios.post(`/api/bff/users/verify`, { token });
    setLoading(false);
    return result.data;
  };

  const emailVerification = async (email: string) => {
    setLoading(true);
    const result = await axios.post(`/api/verify`, { email });
    setLoading(false);
    return result.data;
  };

  const deleteUser = async (user_id: string) => {
    setLoading(true);
    const result = await axios.delete(`/api/bff/users/${user_id}`);
    setLoading(false);
    return result.data;
  };
  const getTotalUserCount = async () => {
    setLoading(true);
    const result = await axios.get('/api/bff/users/dashboard');
    setLoading(false);
    return result?.data;
  };

  useEffect(() => {
    if (!users && !loading && init) {
      getAll(page, limit);
    }
  }, [init]);

  return {
    users,
    getAll,
    loading,
    create,
    update,
    deleteUser,
    getTotalUserCount,
    resetPassword,
    confirmEmail,
    emailVerification
  };
};

export default useUser;
