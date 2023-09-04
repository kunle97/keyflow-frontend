import Dashboard from "./components/Dashboard/Landlord/Dashboard";
import MaintenanceRequests from "./components/Dashboard/Landlord/MaintenanceRequests/MaintenanceRequests";
import CreateMaintenanceRequest from "./components/Dashboard/Landlord/MaintenanceRequests/CreateMaintenanceRequest";
import { createBrowserRouter } from "react-router-dom";
import Properties from "./components/Dashboard/Landlord/Properties/Properties";
import CreateProperty from "./components/Dashboard/Landlord/Properties/CreateProperty";
import ManageProperty from "./components/Dashboard/Landlord/Properties/ManageProperty";
import Units from "./components/Dashboard/Landlord/Units/Units";
import ManageUnit from "./components/Dashboard/Landlord/Units/ManageUnit";
import Tenants from "./components/Dashboard/Landlord/Tenants/Tenants";
import ManageTenant from "./components/Dashboard/Landlord/Tenants/ManageTenant";
import CreateUnit from "./components/Dashboard/Landlord/Units/CreateUnit";
import MyAccount from "./components/Dashboard/MyAccount";
import LandlordLogin from "./components/Dashboard/Landlord/LandlordLogin";
import LandlordRegister from "./components/Dashboard/Landlord/LandlordRegister";
import ForgotPassword from "./components/Dashboard/ForgotPassword";
import { withDashboardContainer } from "./helpers/utils";
import LandingPage from "./components/Landing/LandingPage";
import DashboardProtectedRoute from "./components/DashboardProtectedRoute";
import LoggedInRedirect from "./components/LoggedInRedirect";
import TenantRegister from "./components/Dashboard/Tenant/TenantRegister";
import TenantDashboard from "./components/Dashboard/Tenant/TenantDashboard";
import TenantLogin from "./components/Dashboard/Tenant/TenantLogin";
import TenantMyAccount from "./components/Dashboard/Tenant/TenantMyAccount";
import CreateLeaseTerm from "./components/Dashboard/Landlord/LeaseTerm/CreateLeaseTerm";
import LeaseTerms from "./components/Dashboard/Landlord/LeaseTerm/LeaseTerms";
import ViewRentalApplication from "./components/Dashboard/Landlord/RentalApplications/ViewRentalApplication";
import CreateRentalApplication from "./components/RentalApplication/CreateRentalApplication";
import RentalApplications from "./components/Dashboard/Landlord/RentalApplications/RentalApplications";
import SignLeaseAgreement from "./components/SignLeaseAgreement";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./constants";
import AddPaymentMethod from "./components/Dashboard/Tenant/AddPaymentMethod";
import PageNotFound from "./components/Errors/PageNotFound";

//retrieve token from storage
const token = localStorage.getItem("accessToken");

export const router = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard/landlord/login",
    element: (
      <LoggedInRedirect token={token}>
        <LandlordLogin />
      </LoggedInRedirect>
    ),
  },
  {
    path: "/dashboard/landlord/register",
    element: (
      <LoggedInRedirect token={token}>
        <LandlordRegister />
      </LoggedInRedirect>
    ),
  },
  {
    path: "/dashboard/tenant/register/:lease_agreement_id/:unit_id/:approval_hash/",
    element: (
      <LoggedInRedirect token={token}>
        <Elements stripe={stripePromise}>
          <TenantRegister />
        </Elements>
      </LoggedInRedirect>
    ),
  },
  {
    path: "/dashboard/tenant/login",
    element: (
      <LoggedInRedirect token={token}>
        <TenantLogin />
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
    path: "/dashboard/tenant",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <TenantDashboard />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/add-payment-method",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Elements stripe={stripePromise}>
          <AddPaymentMethod />
        </Elements>
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Dashboard />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/my-account",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <MyAccount />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/my-account",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <TenantMyAccount />
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
    path: "/dashboard/landlord/units",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Units />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/units/:unit_id/:property_id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageUnit />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/units/create/:property_id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateUnit />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/tenants",
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
  {
    path: "/dashboard/landlord/lease-terms/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateLeaseTerm />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/lease-terms/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseTerms />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/rental-applications/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ViewRentalApplication />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/rental-applications/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <RentalApplications />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/rental-application/:unit_id/:landlord_id",
    element: <CreateRentalApplication />,
  },
  {
    path: "/sign-lease-agreement/:lease_agreement_id/:approval_hash",
    element: <SignLeaseAgreement />,
  },
]);
