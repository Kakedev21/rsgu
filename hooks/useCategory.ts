import axios from 'axios';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { CategoryProps } from '@/types/Product';

export interface UseCategoryStateProps {
  selected: CategoryProps | null;
  openDeleteDialog: boolean;
  openFormDialog: boolean;
  setOpenFormDialog: (value: boolean) => void;
  setOpenDeleteDialog: (value: boolean) => void;
  setSelected: (category: CategoryProps | null) => void;
}

export const useCategoryState = create<UseCategoryStateProps>((set) => ({
  selected: null,
  openDeleteDialog: false,
  openFormDialog: false,
  setOpenProfile: (value: boolean) =>
    set((state) => ({ ...state, openProfile: value })),
  setOpenFormDialog: (value: boolean) =>
    set((state) => ({ ...state, openFormDialog: value })),
  setOpenDeleteDialog: (value: boolean) =>
    set((state) => ({ ...state, openDeleteDialog: value })),
  setSelected: (category: CategoryProps | null) =>
    set((state) => ({ ...state, selected: category }))
}));

const useCategory = ({
  page = 1,
  limit = 10,
  init = false
}: {
  page?: number;
  limit?: number;
  init?: boolean;
}) => {
  const [categories, setCategories] = useState<{
    categories: CategoryProps[];
    page: number;
    limit: number;
    count: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const getAllCategory = async (
    page: number,
    limit: number,
    q?: string | null
  ) => {
    setLoading(true);
    const result = await axios.get(`/api/bff/categories`, {
      params: {
        page,
        limit,
        ...(q ? { q: q } : {})
      }
    });
    setLoading(false);
    if (result.data.categories) {
      setCategories(result.data.categories);
    }
  };

  const create = async (payload: CategoryProps) => {
    setLoading(true);
    const result = await axios.post('/api/bff/categories', payload);
    setLoading(false);
    return result.data;
  };

  const getCategory = async (category_id: string) => {
    setLoading(true);
    const result = await axios.get(`/api/bff/categories/${category_id}`);
    setLoading(false);
    return result.data;
  };

  const update = async (payload: CategoryProps, category_id: string) => {
    setLoading(true);
    const result = await axios.put(
      `/api/bff/categories/${category_id}`,
      payload
    );
    setLoading(false);
    return result.data;
  };

  const deleteCategory = async (category_id: string) => {
    setLoading(true);
    const result = await axios.delete(`/api/bff/categories/${category_id}`);
    setLoading(false);
    return result.data;
  };

  useEffect(() => {
    if (!categories && !loading && init) {
      setTimeout(() => {
        getAllCategory(page, limit);
      }, 300);
    }
  }, [init]);

  return {
    categories,
    getAllCategory,
    loading,
    create,
    update,
    deleteCategory,
    getCategory
  };
};

export default useCategory;
