import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
export const CREATE_BOOK = '/book/create';
export const CREATE_BLOG = '/blog/create';
export const axiosInstance = axios.create({
  baseURL: API_URL, // Base URL for all requests
  withCredentials: true,
});
