import { create } from "zustand"

interface UsePageLoaderProps {
    loading: boolean;
    setLoading: (value: boolean) => void;
    description: string | null,
    setDescription: (value: string) => void;
}

const usePageLoader = create<UsePageLoaderProps>(set => ({
    loading: false,
    setLoading: (value: boolean) => set(state => ({...state, loading: value})),
    description: null,
    setDescription: (value: string) => set(state => ({...state, description: value}))
}))

export default usePageLoader