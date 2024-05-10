import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for all requests
  withCredentials: true,
});
