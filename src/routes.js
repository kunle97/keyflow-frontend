import Dashboard from "./components/Dashboard/Dashboard";
import MaintenanceRequests from "./components/Dashboard/Tenant/MaintenanceRequests/MaintenanceRequests";
import CreateMaintenanceRequest from "./components/Dashboard/Tenant/MaintenanceRequests/CreateMaintenanceRequest";
import { createBrowserRouter } from "react-router-dom";
import Properties from "./components/Dashboard/Owner/Properties/Properties";
import CreateProperty from "./components/Dashboard/Owner/Properties/CreateProperty";
import ManageProperty from "./components/Dashboard/Owner/Properties/ManageProperty";
import CreatePortfolio from "./components/Dashboard/Owner/Portfolios/CreatePortfolio";
import Portfolios from "./components/Dashboard/Owner/Portfolios/Portfolios";
import ManagePortfolio from "./components/Dashboard/Owner/Portfolios/ManagePortfolio";
import Units from "./components/Dashboard/Owner/Units/Units";
import ManageUnit from "./components/Dashboard/Owner/Units/ManageUnit";
import Tenants from "./components/Dashboard/Owner/Tenants/Tenants";
import ManageTenant from "./components/Dashboard/Owner/Tenants/ManageTenant";
import CreateUnit from "./components/Dashboard/Owner/Units/CreateUnit";
import MyAccount from "./components/Dashboard/Owner/MyAccount/MyAccount";
import OwnerLogin from "./components/Dashboard/Owner/OwnerLogin";
import OwnerRegister from "./components/Dashboard/Owner/Registration/OwnerRegister";
import ForgotPassword from "./components/Dashboard/PasswordReset/ForgotPassword";
import { withDashboardContainer } from "./helpers/utils";
import LandingPage from "./components/Landing/LandingPage";
import DashboardProtectedRoute from "./components/DashboardProtectedRoute";
import LoggedInRedirect from "./components/LoggedInRedirect";
import TenantRegister from "./components/Dashboard/Tenant/TenantRegister";
import TenantDashboard from "./components/Dashboard/Tenant/TenantDashboard";
import TenantLogin from "./components/Dashboard/Tenant/TenantLogin";
import TenantMyAccount from "./components/Dashboard/Tenant/TenantMyAccount";
import CreateLeaseTemplate from "./components/Dashboard/Owner/LeaseTemplate/CreateLeaseTemplate/CreateLeaseTemplate";
import LeaseTemplates from "./components/Dashboard/Owner/LeaseTemplate/LeaseTemplates";
import ViewRentalApplication from "./components/Dashboard/Owner/RentalApplications/ViewRentalApplication";
import CreateRentalApplication from "./components/RentalApplication/CreateRentalApplication";
import RentalApplications from "./components/Dashboard/Owner/RentalApplications/RentalApplications";
import SignLeaseAgreement from "./components/SignLeaseAgreement";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./constants";
import AddPaymentMethod from "./components/Dashboard/AddPaymentMethod";
import PageNotFound from "./components/Errors/PageNotFound";
import MyLeaseAgreement from "./components/Dashboard/Tenant/LeaseAgreement/MyLeaseAgreement";
import OwnerTransactions from "./components/Dashboard/Owner/Transactions/OwnerTransactions";
import OwnerTransactionDetail from "./components/Dashboard/Owner/Transactions/OwnerTransactionDetail";
import OwnerMaintenanceRequests from "./components/Dashboard/Owner/MaintenaceRequests/OwnerMaintenanceRequests";
import OwnerMaintenanceRequestDetail from "./components/Dashboard/Owner/MaintenaceRequests/OwnerMaintenanceRequestDetail";
import ResetPassword from "./components/Dashboard/PasswordReset/ResetPassword";
import ActivateAccount from "./components/Dashboard/AccountActivation/ActivateAccount";
import ActivateAccountMessage from "./components/Dashboard/AccountActivation/ActivateAccountMessage";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import HomeWorkOutlined from "@mui/icons-material/HomeWorkOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import {
  AddHomeOutlined,
  AddHomeWorkOutlined,
  HolidayVillageOutlined,
} from "@mui/icons-material";
import CampaignIcon from "@mui/icons-material/Campaign";
import ManageLeaseTemplate from "./components/Dashboard/Owner/LeaseTemplate/ManageLeaseTemplate";
import Notifications from "./components/Dashboard/Notifications/Notifications";
import { NotificationDetail } from "./components/Dashboard/Notifications/NotificationDetail";
import Logout from "./components/Dashboard/Logout";
import ViewLeaseAgreements from "./components/Dashboard/Owner/LeaseAgreements/ViewLeaseAgreements";
import LeaseAgreementDetail from "./components/Dashboard/Owner/LeaseAgreements/LeaseAgreementDetail";
import LeaseCancellationRequests from "./components/Dashboard/Owner/LeaseCancellations/LeaseCancellationRequests";
import LeaseCancellationRequestDetail from "./components/Dashboard/Owner/LeaseCancellations/LeaseCancellationRequestDetail";
import LeaseRenewalRequests from "./components/Dashboard/Owner/LeaseRenewals/LeaseRenewalRequests";
import LeaseRenewalRequestDetail from "./components/Dashboard/Owner/LeaseRenewals/LeaseRenewalRequestDetail";
import LeaseRenewalAcceptForm from "./components/Dashboard/Owner/LeaseRenewals/LeaseRenewalAcceptForm";
import TenantLeaseRenewalRequests from "./components/Dashboard/Tenant/LeaseAgreement/LeaseRenewal/TenantLeaseRenewalRequests";
import TenantLeaseRenewalRequestDetail from "./components/Dashboard/Tenant/LeaseAgreement/LeaseRenewal/TenantLeaseRenewalRequestDetail";
import TenantLeaseCancellationRequests from "./components/Dashboard/Tenant/LeaseAgreement/LeaseCancellation/TenantLeaseCancellationRequests";
import Messages from "./components/Dashboard/Messaging/Messages";
import { ContactPage } from "./components/Landing/ContactPage";
import PricingPage from "./components/Landing/PricingPage";
import FeaturesPage from "./components/Landing/FeaturesPage";
import BlogPage from "./components/Landing/BlogPage";
import BillingEntries from "./components/Dashboard/Owner/BillingEntry/BillingEntries";
import ManageBillingEntry from "./components/Dashboard/Owner/BillingEntry/ManageBillingEntry";
import CreateBillingEntry from "./components/Dashboard/Owner/BillingEntry/CreateBillingEntry";
import Bills from "./components/Dashboard/Tenant/Bills/Bills";
import PayBill from "./components/Dashboard/Tenant/Bills/PayBill";
import Annoucements from "./components/Dashboard/Owner/Annoucements/Annoucements";
import ManageAnnouncement from "./components/Dashboard/Owner/Annoucements/ManageAnnouncement";
import CreateAccouncement from "./components/Dashboard/Owner/Annoucements/CreateAnnouncement";

//Prototype conponents
import Accounts from "./components/Dashboard/UIComponents/Prototypes/Pages/Accounts";
import WebsiteBuilder from "./components/Dashboard/UIComponents/Prototypes/Pages/WebsiteBuilder";
import OccupancyProgress from "./components/Dashboard/UIComponents/Prototypes/Pages/OccupancyProgress";
import BillDetail from "./components/Dashboard/Tenant/Bills/BillDetail";

//retrieve token from storage
const token = localStorage.getItem("accessToken");

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
    path: "/contact",
    element: <ContactPage />,
    isSearchable: false,
    label: "Contact Us",
  },
  {
    path: "/pricing",
    element: <PricingPage />,
    isSearchable: false,
    label: "Pricing",
  },
  {
    path: "/features",
    element: <FeaturesPage />,
    isSearchable: false,
    label: "Features",
  },
  {
    path: "/blog",
    element: <BlogPage />,
    isSearchable: false,
    label: "Blog",
  },
  {
    path: "/dashboard/owner/login",
    element: (
      <LoggedInRedirect token={token}>
        <OwnerLogin />
      </LoggedInRedirect>
    ),
    isSearchable: false,
    label: "Owner Login",
  },
  {
    path: "/dashboard/logout",
    element: <Logout />,
    isSearchable: false,
    label: "Owner Logout",
  },
  {
    path: "/dashboard/owner/register",
    element: (
      <LoggedInRedirect token={token}>
        <Elements stripe={stripePromise}>
          <OwnerRegister />
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
    path: "/dashboard/tenant/register/:tenant_invite_id/:unit_id/:approval_hash/",
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
    path: "/dashboard/add-payment-method",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Elements stripe={stripePromise}>
          <AddPaymentMethod />
        </Elements>
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/",
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
    breadcrumbs: [],
  },
  {
    path: "/dashboard/owner/my-account",
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
    breadcrumbs: ["My Account"],
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
    breadcrumbs: ["My Account"],
  },
  {
    path: "/dashboard/owner/properties",
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
    breadcrumbs: ["Properties"],
  },
  {
    path: "/dashboard/owner/properties/create",
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
    breadcrumbs: ["Properties", "Create Property"],
  },
  {
    path: "/dashboard/owner/properties/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageProperty />
      </DashboardProtectedRoute>
    ),
    breadcrumbs: ["Properties", "Manage Property", "[:id]_name"],
  },
  {
    path: "/dashboard/owner/portfolios",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Portfolios />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Portfolios",
    description: "Manage your portfolios",
    isQuickLink: true,
    muiIcon: <FolderCopyIcon />,
  },
  {
    path: "/dashboard/owner/portfolios/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreatePortfolio />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Create Portfolio",
    description: "Create a new portfolio",
    isQuickLink: true,
    muiIcon: <CreateNewFolderIcon />,
  },
  {
    path: "/dashboard/owner/portfolios/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManagePortfolio />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/units",
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
    path: "/dashboard/owner/units/:unit_id/:property_id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageUnit />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/units/create/:property_id",
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
    path: "/dashboard/owner/units/create/",
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
    path: "/dashboard/owner/tenants",
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
    path: "/dashboard/owner/tenants/:tenant_id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageTenant />
      </DashboardProtectedRoute>
    ),
  },

  {
    path: "/dashboard/owner/maintenance-requests",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <OwnerMaintenanceRequests />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Maintenance Requests",
    description: "Manage your maintenance requests",
    isQuickLink: true,
    muiIcon: <HandymanOutlinedIcon />,
  },

  {
    path: "/dashboard/owner/maintenance-requests/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <OwnerMaintenanceRequestDetail />
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
    path: "/dashboard/tenant/bills/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Bills />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/bills/:invoice_id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <BillDetail />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/bills/pay/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <PayBill />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/lease-renewal-requests/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <TenantLeaseRenewalRequests />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/lease-renewal-requests/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <TenantLeaseRenewalRequestDetail />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tenant/lease-cancellation-requests/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <TenantLeaseCancellationRequests />
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
    path: "/dashboard/owner/lease-agreements/",
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
    path: "/dashboard/owner/lease-agreements/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseAgreementDetail />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/lease-cancellation-requests/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseCancellationRequests />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Lease Cancellation Requests",
    description: "Manage your lease cancellation requests",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
  },
  {
    path: "/dashboard/owner/lease-cancellation-requests/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseCancellationRequestDetail />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/lease-renewal-requests/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseRenewalRequests />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Lease Renewal Requests",
    description: "Manage your lease renewal requests",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
  },
  {
    path: "/dashboard/owner/lease-renewal-requests/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseRenewalRequestDetail />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/lease-renewal-accept-form/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseRenewalAcceptForm />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/lease-templates/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateLeaseTemplate isLeaseRenewal={false} />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Create Lease Term",
    description: "Create a new lease term",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
  },
  {
    path: "/dashboard/owner/lease-templates/",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <LeaseTemplates />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Lease Terms",
    description: "Manage your lease terms",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
  },
  {
    path: "/dashboard/owner/lease-templates/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageLeaseTemplate />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Lease Terms",
    description: "Manage your lease terms",
    isQuickLink: true,
    muiIcon: <DescriptionOutlined />,
  },
  {
    path: "/dashboard/owner/rental-applications/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ViewRentalApplication />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/rental-applications/",
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
    path: "/rental-application/:unit_id/:owner_id",
    element: <CreateRentalApplication />,
  },
  {
    path: "/sign-lease-agreement/:lease_agreement_id/:approval_hash",
    element: <SignLeaseAgreement />,
  },
  {
    path: "/dashboard/owner/transactions",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <OwnerTransactions />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Transactions",
    description: "Manage your transactions",
    isQuickLink: true,
    muiIcon: <PaidOutlined />,
  },
  {
    path: "/dashboard/owner/transactions/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <OwnerTransactionDetail />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/notifications",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Notifications />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/notifications/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <NotificationDetail />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/messages",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Messages />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Messages",
    description: "View your messages",
    isQuickLink: true,
    muiIcon: <MessageOutlinedIcon />,
  },
  {
    path: "/dashboard/messages/:thread_id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Messages />
      </DashboardProtectedRoute>
    ),
    isSearchable: false,
  },
  {
    path: "/dashboard/owner/billing-entries",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <BillingEntries />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Billing Entries",
    description: "Manage your billing entries",
    isQuickLink: true,
    muiIcon: <PaidOutlined />,
  },
  {
    path: "/dashboard/owner/billing-entries/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateBillingEntry />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Create Billing Entry",
    description: "Create a new billing entry",
    isQuickLink: true,
    muiIcon: <PaidOutlined />,
  },
  {
    path: "/dashboard/owner/billing-entries/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageBillingEntry />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Billing Entry",
    description: "Manage your billing entry",
    isQuickLink: true,
    muiIcon: <PaidOutlined />,
  },
  {
    path: "/dashboard/owner/announcements",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Annoucements />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Announcements",
    description: "Manage your announcements",
    isQuickLink: true,
    muiIcon: <CampaignIcon />,
  },
  {
    path: "/dashboard/owner/announcements/create",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <CreateAccouncement />
      </DashboardProtectedRoute>
    ),
    isSearchable: true,
    label: "Create Announcement",
    description: "Create a new announcement",
    isQuickLink: true,
    muiIcon: <CampaignIcon />,
  },
  {
    path: "/dashboard/owner/announcements/:id",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <ManageAnnouncement />
      </DashboardProtectedRoute>
    ),
    isSearchable: false,
    label: "Announcement",
    description: "Manage your announcement",
    isQuickLink: false, 
  },
  //Prototype routes
  {
    path: "/dashboard/owner/accounts",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <Accounts />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/website-builder",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <WebsiteBuilder />
      </DashboardProtectedRoute>
    ),
  },
  {
    path: "/dashboard/owner/occupancy-progress",
    element: withDashboardContainer(
      <DashboardProtectedRoute token={token}>
        <OccupancyProgress />
      </DashboardProtectedRoute>
    ),
  },
];

export const router = createBrowserRouter(routes);
