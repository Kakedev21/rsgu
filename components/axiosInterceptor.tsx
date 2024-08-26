'use client'

import usePageLoader from "@/hooks/usePageLoader";
import useToken from "@/hooks/useToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const AxiosInterceptor = () => {
    const router = useRouter();
    const tokenHook = useToken();
    const pageLoader = usePageLoader();
    useEffect(() => {
        axios.interceptors.request.use(
            async (config) => {
              const token = window.localStorage.getItem("accessToken")
              
              if (token) {
                config.headers.Authorization = `Bearer ${token}`;
              }
              console.log("config request", config)
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );
        axios.interceptors.response.use(
            async (config) => {
              console.log("config", config, pageLoader)
              if (config.data?.status === 401 && !pageLoader.loading) {
                pageLoader.setDescription("Refreshing Token...")
                pageLoader.setLoading(true)
                window.localStorage.removeItem("accessToken");
                await tokenHook.generateAccessToken()
                setTimeout(() => {
                  pageLoader.setLoading(false)
                  pageLoader.setDescription("")
                  router.refresh()

                }, 2000)
              }
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );
    }, [])

    return (
        <>
        </>
    );
}
 
export default AxiosInterceptor;