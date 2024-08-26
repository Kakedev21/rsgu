'use client'
import axios from 'axios';
import jwt from 'jsonwebtoken';


const useToken = () => {
    const generateAccessToken = async () => {
        if (!window.localStorage.getItem("accessToken")) {
            const { data } = await axios.get('/api/jwt-token');
            window.localStorage.setItem("accessToken", data.token);
            console.log("token", data.token)
            return data.token;
        }
    }
    const destroyToken = () => window.localStorage.removeItem("accessToken")
    return {
        generateAccessToken,
        destroyToken
    }
}
 
export default useToken;