export const BASE_API_URL = 'http://127.0.0.1:8000/api';
export const authUser  = localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser")) : {};
export const token = localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : {};