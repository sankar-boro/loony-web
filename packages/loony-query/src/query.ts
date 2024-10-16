import axios from 'axios';
import config from '../../../config/app.config.json'

const BASE_URL = `${config.API_URL}/api`;
export const CREATE_BOOK = '/book/create';
export const CREATE_BLOG = '/blog/create';
export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for all requests
  withCredentials: true,
});
