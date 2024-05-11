import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_API_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for all requests
  withCredentials: true,
});
