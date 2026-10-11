import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

export const bankingApi = {
  getHealth: async () => {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  },

  getState: async () => {
    const res = await axios.get(`${API_BASE}/banking/state`);
    return res.data;
  },

  intercept: async (payload) => {
    const res = await axios.post(`${API_BASE}/firewall/intercept`, payload);
    return res.data;
  },

  resetState: async () => {
    const res = await axios.post(`${API_BASE}/banking/reset`);
    return res.data;
  },

  login: async (credentials) => {
    const res = await axios.post(`${API_BASE}/auth/login`, credentials);
    return res.data;
  }
};
