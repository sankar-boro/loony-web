import axios from 'axios';

const API_URL = `${process.env.API_URL}/api`;
export const CREATE_BOOK = '/book/create';
export const CREATE_BLOG = '/blog/create';
export const axiosInstance = axios.create({
  baseURL: API_URL, // Base URL for all requests
  withCredentials: true,
});
