import Dashboard from "./components/Landlord/Dashboard";
import MaintenanceRequests from "./components/Landlord/MaintenanceRequests/MaintenanceRequests";
import CreateMaintenanceRequest from "./components/Landlord/MaintenanceRequests/CreateMaintenanceRequest";
import { createBrowserRouter } from "react-router-dom";
import Properties from "./components/Landlord/Properties/Properties";
import CreateProperty from "./components/Landlord/Properties/CreateProperty";
import ManageProperty from "./components/Landlord/Properties/ManageProperty";
import Units from "./components/Landlord/Properties/Units";
import Tenants from "./components/Landlord/Tenants/Tenants";
import ManageTenant from "./components/Landlord/Tenants/ManageTenant";
import CreateUnit from "./components/Landlord/Properties/CreateUnit";
import MyAccount from "./components/MyAccount";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import { withDashboardContainer } from "./helpers/utils";

export const router = createBrowserRouter([
  {
    path: "/dashboard/login",
    element: <Login />,
  },
  {
    path: "/dashboard/register",
    element: <Register />,
  },
  {
    path: "/dashboard/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: withDashboardContainer(<Dashboard />),
  },
  {
    path: "/dashboard/my-account",
    element: withDashboardContainer(<MyAccount />),
  },
  {
    path: "/dashboard/properties",
    element: withDashboardContainer(<Properties />),
  },
  {
    path: "/dashboard/properties/create",
    element: withDashboardContainer(<CreateProperty />),
  },
  {
    path: "/dashboard/properties/:id",
    element: withDashboardContainer(<ManageProperty />),
  },
  {
    path: "/dashboard/units",
    element: withDashboardContainer(<Units />),
  },
  {
    path: "/dashboard/units/create",
    element: withDashboardContainer(<CreateUnit />),
  },
  {
    path: "/dashboard/tenants",
    element: withDashboardContainer(<Tenants />),
  },
  {
    path: "/dashboard/tenants/:id",
    element: withDashboardContainer(<ManageTenant />),
  },
  {
    path: "/dashboard/maintenance-requests",
    element: withDashboardContainer(<MaintenanceRequests />),
  },
  {
    path: "/dashboard/maintenance-requests/create",
    element: withDashboardContainer(<CreateMaintenanceRequest />),
  },
]);
