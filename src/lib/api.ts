import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust for production
  withCredentials: true, // Send cookies with requests
});

export default api;