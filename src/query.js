import axios from 'axios';
const { REACT_APP_HTTP, REACT_APP_HOST, REACT_APP_PORT } = process.env;
const BASE_URL = `${REACT_APP_HTTP}://${REACT_APP_HOST}:${REACT_APP_PORT}/api`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for all requests
});
