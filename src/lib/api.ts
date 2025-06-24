import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://ph-banner-maker-server.vercel.app/api',
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

export default api;