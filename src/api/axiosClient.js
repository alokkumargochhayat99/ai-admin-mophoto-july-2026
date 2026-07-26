import axios from "axios";


// Create axios instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_URL, // your backend base URL
  withCredentials: true,
});

// Attach Authorization token automatically 
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('moToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('moToken');
  
     
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
