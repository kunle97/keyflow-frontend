import Dashboard from "./components/Dashboard/Landlord/Dashboard";
import MaintenanceRequests from "./components/Dashboard/Tenant/MaintenanceRequests/MaintenanceRequests";
import CreateMaintenanceRequest from "./components/Dashboard/Tenant/MaintenanceRequests/CreateMaintenanceRequest";
import { createBrowserRouter } from "react-router-dom";
import Properties from "./components/Dashboard/Landlord/Properties/Properties";
import CreateProperty from "./components/Dashboard/Landlord/Properties/CreateProperty";
import ManageProperty from "./components/Dashboard/Landlord/Properties/ManageProperty";
import Units from "./components/Dashboard/Landlord/Units/Units";
import ManageUnit from "./components/Dashboard/Landlord/Units/ManageUnit";
import Tenants from "./components/Dashboard/Landlord/Tenants/Tenants";
import ManageTenant from "./components/Dashboard/Landlord/Tenants/ManageTenant";
import CreateUnit from "./components/Dashboard/Landlord/Units/CreateUnit";
import MyAccount from "./components/Dashboard/Landlord/MyAccount/MyAccount";
import LandlordLogin from "./components/Dashboard/Landlord/LandlordLogin";
import LandlordRegister from "./components/Dashboard/Landlord/Registration/LandlordRegister";
import ForgotPassword from "./components/Dashboard/PasswordReset/ForgotPassword";
import { withDashboardContainer } from "./helpers/utils";
import LandingPage from "./components/Landing/LandingPage";
import DashboardProtectedRoute from "./components/DashboardProtectedRoute";
import LoggedInRedirect from "./components/LoggedInRedirect";
import TenantRegister from "./components/Dashboard/Tenant/TenantRegister";
import TenantDashboard from "./components/Dashboard/Tenant/TenantDashboard";
import TenantLogin from "./components/Dashboard/Tenant/TenantLogin";
import TenantMyAccount from "./components/Dashboard/Tenant/TenantMyAccount";
import CreateLeaseTerm from "./components/Dashboard/Landlord/LeaseTerm/CreateLeaseTerm/CreateLeaseTerm";
import LeaseTerms from "./components/Dashboard/Landlord/LeaseTerm/LeaseTerms";
import ViewRentalApplication from "./components/Dashboard/Landlord/RentalApplications/ViewRentalApplication";
import CreateRentalApplication from "./components/RentalApplication/CreateRentalApplication";
import RentalApplications from "./components/Dashboard/Landlord/RentalApplications/RentalApplications";
import SignLeaseAgreement from "./components/SignLeaseAgreement";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./constants";
import AddPaymentMethod from "./components/Dashboard/Tenant/AddPaymentMethod";
import PageNotFound from "./components/Errors/PageNotFound";
import MyLeaseAgreement from "./components/Dashboard/Tenant/MyLeaseAgreement";
import LandlordTransactions from "./components/Dashboard/Landlord/Transactions/LandlordTransactions";
import LandlordTransactionDetail from "./components/Dashboard/Landlord/Transactions/LandlordTransactionDetail";
import LandlordMaintenanceRequests from "./components/Dashboard/Landlord/MaintenaceRequests/LandlordMaintenanceRequests";
import LandlordMaintenanceRequestDetail from "./components/Dashboard/Landlord/MaintenaceRequests/LandlordMaintenanceRequestDetail";
import ResetPassword from "./components/Dashboard/PasswordReset/ResetPassword";
import ActivateAccount from "./components/Dashboard/AccountActivation/ActivateAccount";
import ActivateAccountMessage from "./components/Dashboard/AccountActivation/ActivateAccountMessage";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import HomeWorkOutlined from "@mui/icons-material/HomeWorkOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import {
  AddHomeOutlined,
  AddHomeWorkOutlined,
  HolidayVillageOutlined,
} from "@mui/icons-material";
import UpdateLeaseTerm from "./components/Dashboard/Landlord/LeaseTerm/UpdateLeaseTerm";
import Notifications from "./components/Dashboard/Notifications/Notifications";
import { NotificationDetail } from "./components/Dashboard/Notifications/NotificationDetail";
import Logout from "./components/Dashboard/Logout";
import ViewLeaseAgreements from "./components/Dashboard/Landlord/LeaseAgreements/ViewLeaseAgreements";
import LeaseAgreementDetail from "./components/Dashboard/Landlord/LeaseAgreements/LeaseAgreementDetail";
//retrieve token from storage
const token = localStorage.getItem("authTokens");

export const routes = [

  {
    path: "*",
    element: <PageNotFound />,
    isSearchable: false,
    label: "Page Not Found",
  },
  {
    path: "/",
    element: <LandingPage />,
    isSearchable: false,
    label: "Home",
  },
  {
    path: "/dashboard/landlord/login",
    element: (
      <LoggedInRedirect token={token}>
        <LandlordLogin />
      </LoggedInRedirect>
    ),
    isSearchable: false,
    label: "Landlord Login",
  },
  {
    path: "/dashboard/logout",
    element: (
      <DashboardProtectedRoute token={token}>
        <Logout />
      </DashboardProtectedRoute>
    ),
    isSearchable: false,
    label: "Landlord Logout",
  },
  {
    path: "/dashboard/landlord/register",
    element: (
      <LoggedInRedirect token={token}>
        <Elements stripe={stripePromise}>
          <LandlordRegister />
        </Elements>
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
    path: "/dashboard/activate-account/",
    element: <ActivateAccountMessage />,
  },
  {
    path: "/dashboard/activate-user-account/:token/",
    element: <ActivateAccount />,
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
    path: "/dashboard/reset-password/:token/",
    element: (
      <LoggedInRedirect token={token}>
        <ResetPassword />
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
    isSearchable: true,
    label: "Dashboard",
    description: "An overview of your properties",
    isQuickLink: true,
    muiIcon: <DashboardOutlined />,
  },
  {
    path: "/dashboard/landlord/my-account",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <MyAccount />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "My Account",
    description: "Manage your account",
    isQuickLink: true,
    muiIcon: <PeopleAltOutlined />,
  },
  {
    path: "/dashboard/tenant/my-account",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <TenantMyAccount />
      </DashboardProtectedRoute>
    ),
    isSearchable: false,
    label: "My Account (Tenant)",
  },
  {
    path: "/dashboard/landlord/properties",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Properties />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Properties",
    description: "Manage your properties",
    isQuickLink: true,
    muiIcon: <HomeWorkOutlined />,
  },
  {
    path: "/dashboard/landlord/properties/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateProperty />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Create Property",
    description: "Create a new property",
    isQuickLink: true,
    muiIcon: <AddHomeWorkOutlined />,
  },
  {
    path: "/dashboard/landlord/properties/:id",
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
    isSearchable: true,
    label: "Units",
    description: "Manage your units",
    isQuickLink: true,
    muiIcon: <HolidayVillageOutlined />,
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
    isSearchable: false,
    label: "Create Unit",
    description: "Create a new unit",
    isQuickLink: false,
    muiIcon: <AddHomeOutlined />,
  },
  {
    path: "/dashboard/landlord/units/create/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateUnit />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Create Unit",
    description: "Create a new unit",
    isQuickLink: false,
    muiIcon: <AddHomeOutlined />,
  },
  {
    path: "/dashboard/landlord/tenants",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Tenants />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Tenants",
    description: "Manage your tenants",
    isQuickLink: true,
    muiIcon: <PeopleAltOutlined />,
  },
  {
    path: "/dashboard/landlord/tenants/:tenant_id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageTenant />
      </DashboardProtectedRoute>
    ),
  },

  {
    path: "/dashboard/landlord/maintenance-requests",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LandlordMaintenanceRequests />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Maintenance Requests",
    description: "Manage your maintenance requests",
    isQuickLink: true,
    muiIcon: <HandymanOutlinedIcon />,
  },

  {
    path: "/dashboard/landlord/maintenance-requests/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LandlordMaintenanceRequestDetail />
      </DashboardProtectedRoute>
    ),
  },

  {
    path: "/dashboard/tenant/my-lease",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <MyLeaseAgreement />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/maintenance-requests",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <MaintenanceRequests />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/maintenance-requests/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateMaintenanceRequest />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/lease-agreements/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ViewLeaseAgreements />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Lease Agreements",
    description: "Manage your lease agreements",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
  },
  {
    path: "/dashboard/landlord/lease-agreements/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseAgreementDetail />
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
    isSearchable: true,
    label: "Create Lease Term",
    description: "Create a new lease term",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
  },
  {
    path: "/dashboard/landlord/lease-terms/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseTerms />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Lease Terms",
    description: "Manage your lease terms",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
  },
  {
    path: "/dashboard/landlord/lease-terms/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <UpdateLeaseTerm />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Lease Terms",
    description: "Manage your lease terms",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
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
    isSearchable: true,
    label: "Rental Applications",
    description: "Manage your rental applications",
    isQuickLink: true,
    muiIcon: <ReceiptLongOutlined />,
  },
  {
    path: "/rental-application/:unit_id/:landlord_id",
    element: <CreateRentalApplication />,
  },
  {
    path: "/sign-lease-agreement/:lease_agreement_id/:approval_hash",
    element: <SignLeaseAgreement />,
  },
  {
    path: "/dashboard/landlord/transactions",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LandlordTransactions />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Transactions",
    description: "Manage your transactions",
    isQuickLink: true,
    muiIcon: <PaidOutlined />,
  },
  {
    path: "/dashboard/landlord/transactions/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LandlordTransactionDetail />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/notifications",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Notifications />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/landlord/notifications/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <NotificationDetail />
      </DashboardProtectedRoute>
    ),
  },
];

export const router = createBrowserRouter(routes);
