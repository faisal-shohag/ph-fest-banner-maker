import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://ph-banner-maker-server.vercel.app/api',
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true, 
});

export default api;