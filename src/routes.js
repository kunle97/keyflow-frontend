import Dashboard from "./components/Dashboard/Landlord/Dashboard";
import MaintenanceRequests from "./components/Dashboard/Landlord/MaintenanceRequests/MaintenanceRequests";
import CreateMaintenanceRequest from "./components/Dashboard/Landlord/MaintenanceRequests/CreateMaintenanceRequest";
import { createBrowserRouter } from "react-router-dom";
import Properties from "./components/Dashboard/Landlord/Properties/Properties";
import CreateProperty from "./components/Dashboard/Landlord/Properties/CreateProperty";
import ManageProperty from "./components/Dashboard/Landlord/Properties/ManageProperty";
import Units from "./components/Dashboard/Landlord/Properties/Units";
import Tenants from "./components/Dashboard/Landlord/Tenants/Tenants";
import ManageTenant from "./components/Dashboard/Landlord/Tenants/ManageTenant";
import CreateUnit from "./components/Dashboard/Landlord/Properties/CreateUnit";
import MyAccount from "./components/Dashboard/MyAccount";
import Login from "./components/Dashboard/Login";
import Register from "./components/Dashboard/Register";
import ForgotPassword from "./components/Dashboard/ForgotPassword";
import { withDashboardContainer } from "./helpers/utils";
import LandingPage from "./components/Landing/LandingPage";
import DashboardProtectedRoute from "./components/DashboardProtectedRoute";
import LoggedInRedirect from "./components/LoggedInRedirect";
//retrieve token from storage
const token = localStorage.getItem("accessToken");

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard/login",
    element: (
      <LoggedInRedirect token={token}>
        <Login />
      </LoggedInRedirect>
    ),
  },
  {
    path: "/dashboard/register",
    element: (
      <LoggedInRedirect token={token}>
        <Register />
      </LoggedInRedirect>
    ),
  },
  {
    path: "/dashboard/forgot-password",
    element: (
      <LoggedInRedirect token={token}>
        <ForgotPassword />
      </LoggedInRedirect>
    ),
  },
  {
    path: "/dashboard",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Dashboard />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/my-account",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <MyAccount />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/properties",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Properties />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/properties/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateProperty />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/properties/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageProperty />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/units",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Units />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/units/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateUnit />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenants",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Tenants />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenants/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageTenant />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/maintenance-requests",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <MaintenanceRequests />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/maintenance-requests/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateMaintenanceRequest />
      </DashboardProtectedRoute>
    ),
  },
]);
