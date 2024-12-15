import axios from 'axios';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { SizeProps } from '@/controller/Size';

export interface UseSizeStateProps {
  selected: SizeProps | null;
  openDeleteDialog: boolean;
  openFormDialog: boolean;
  setOpenFormDialog: (value: boolean) => void;
  setOpenDeleteDialog: (value: boolean) => void;
  setSelected: (size: SizeProps | null) => void;
}

export const useSizeState = create<UseSizeStateProps>((set) => ({
  selected: null,
  openDeleteDialog: false,
  openFormDialog: false,
  setOpenFormDialog: (value: boolean) =>
    set((state) => ({ ...state, openFormDialog: value })),
  setOpenDeleteDialog: (value: boolean) =>
    set((state) => ({ ...state, openDeleteDialog: value })),
  setSelected: (size: SizeProps | null) =>
    set((state) => ({ ...state, selected: size }))
}));

const useSize = ({
  page = 1,
  limit = 10,
  init = false
}: {
  page?: number;
  limit?: number;
  init?: boolean;
}) => {
  const [sizes, setSizes] = useState<{
    sizes: SizeProps[];
    page: number;
    limit: number;
    count: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAll = async (page: number, limit: number, q?: string | null) => {
    setLoading(true);
    const result = await axios.get('/api/bff/sizes', {
      params: {
        page,
        limit,
        ...(q ? { q: q } : {})
      }
    });
    setLoading(false);
    if (result.data.sizes) {
      setSizes(result.data.sizes);
    }
  };

  const create = async (payload: SizeProps) => {
    setLoading(true);
    const result = await axios.post('/api/bff/sizes', payload);
    setLoading(false);
    return result.data;
  };

  const getById = async (size_id: string) => {
    setLoading(true);
    const result = await axios.get(`/api/bff/sizes/${size_id}`);
    setLoading(false);
    return result.data;
  };

  const update = async (payload: SizeProps, size_id: string) => {
    setLoading(true);
    const result = await axios.put(`/api/bff/sizes/${size_id}`, payload);
    setLoading(false);
    return result.data;
  };

  const deleteSize = async (size_id: string) => {
    setLoading(true);
    const result = await axios.delete(`/api/bff/sizes/${size_id}`);
    setLoading(false);
    return result.data;
  };

  useEffect(() => {
    if (!sizes && !loading && init) {
      setTimeout(() => {
        getAll(page, limit);
      }, 300);
    }
  }, [init]);

  return {
    sizes,
    getAll,
    loading,
    create,
    update,
    deleteSize,
    getById
  };
};

export default useSize;
