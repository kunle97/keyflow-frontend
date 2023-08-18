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
