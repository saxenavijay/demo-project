import axios from 'axios';
import { store } from '../store/store';

const axiosInstance = axios.create({
    baseURL: `/api/`,
});

axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.auth.token;
    //config.params = config.params || {};
    //config.params['Authorization'] = "Bearer "+token;
    config.headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
      };
    // config.proxy = {
    //     host: 'localhost',
    //     port: 5000
    // }

	// console.log(config,token);
    return config;
});

export default axiosInstance;
