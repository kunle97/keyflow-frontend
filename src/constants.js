export const BASE_API_URL = 'http://127.0.0.1:8000/api';
export const authUser  = localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser")) : {};
export const token = localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : {};
export const stripe_onboarding_link = localStorage.getItem("stripe_onboarding_link") ? localStorage.getItem("stripe_onboarding_link") : {};
//Colors - probably should use tailwind colors
export const uiGreen = "#3aaf5c";
export const uiGrey1 = "#2c3a4a";