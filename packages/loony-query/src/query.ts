import axios from 'axios';
import config from '../../../config/app.config.json'

const appConfig: any = config
const env: string = config.env
const currentConfig: any = appConfig[env]
const { API_URL } = currentConfig

export const CREATE_BOOK = '/book/create';
export const CREATE_BLOG = '/blog/create';
export const axiosInstance = axios.create({
  baseURL: API_URL + "/api", // Base URL for all requests
  withCredentials: true,
});
