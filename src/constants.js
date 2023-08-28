export const BASE_API_URL = "http://127.0.0.1:8000/api";
export const authUser = localStorage.getItem("authUser")
  ? JSON.parse(localStorage.getItem("authUser"))
  : {};
export const token = localStorage.getItem("accessToken")
  ? localStorage.getItem("accessToken")
  : {};
export const stripe_onboarding_link = localStorage.getItem(
  "stripe_onboarding_link"
)
  ? localStorage.getItem("stripe_onboarding_link")
  : {};
//Colors - probably should use tailwind colors
export const uiGreen = "#3aaf5c";
export const uiGrey1 = "#2c3a4a";
export const uiGrey2 = "#364658";

export const landlordMenuItems = [
  { label: "Dashboard", link: "/dashboard/landlord", icon: "fas fa-tachometer-alt" },
  { label: "Tenants", link: "/dashboard/landlord/tenants", icon: "fa fa-group" },
  { label: "Properties", link: "/dashboard/properties", icon: "fa fa-home" },
  { label: "Maintenance Requests", link: "/dashboard/maintenance-requests", icon: "fas fa-tools" },
  { label: "Lease Agreements", link: "/dashboard/landlord", icon: "fas fa-user-circle" },
  { label: "Rental Applications", link: "/dashboard/landlord/rental-applications", icon: "fas fa-tachometer-alt" },
];
