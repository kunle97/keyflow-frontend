import { faker } from "@faker-js/faker";
import { loadStripe } from "@stripe/stripe-js";
import { createTheme } from "react-data-table-component";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DescriptionIcon from "@mui/icons-material/Description";
import HandymanIcon from "@mui/icons-material/Handyman";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

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
export const uiGreen = "#3aaf5c"; //alt: "#06b474";
export const uiRed = "#FF4040";
export const uiGrey = "#eff4f5";
export const uiGrey1 = "#2c3a4a";
export const uiGrey2 = "#364658";
export const uiGrey3 = "#dcdde3"; //Used to set background color of a read notification

export const validationMessageStyle = {
  color: "red",
  fontSize: "14px",
};

export const muiDataTableTheme = createTheme({
  overrides: {
    // Define your custom styles here
    MUIDataTable: {
      root: {
        backgroundColor: "#2c3a4a",
        color: "#fff",

        "& .MuiToolbar-root": {
          backgroundColor: "#2c3a4a",
          color: "#fff",

          "& .MuiIconButton-root": {
            color: "#fff",
          },
        },
      },
    },
  },
});

export const devToolInputStyle = {
  background: `white !important`,
  color: "black",
  width: "100%",
  borderRadius: "5px",
  padding: "10px",
  outline: "none",
  border: "none",
};
const muiIconStyle = { color: uiGreen };
export const landlordMenuItems = [
  {
    label: "Dashboard",
    link: "/dashboard/landlord",
    icon: "fas fa-tachometer-alt",
    muiIcon: <DashboardIcon sx={muiIconStyle} />,
    description: "View your dashboard",
    isSearchable: true,
    dataTestId: "landlord-dashboard-menu-item",
  },
  {
    label: "Properties",
    link: "/dashboard/landlord/properties",
    muiIcon: <HomeWorkIcon sx={muiIconStyle} />,
    description: "View your properties",
    icon: "fa fa-home",
    isSearchable: true,
    dataTestId: "landlord-properties-dropdown-menu-item",
    subMenuItems: [
      {
        label: "Properties",
        link: "/dashboard/landlord/properties",
        muiIcon: <HomeWorkIcon sx={muiIconStyle} />,
        description: "View your properties",
        icon: "fa fa-home",
        isSearchable: true,
        dataTestId: "landlord-properties-menu-item",
      },
      {
        label: "Portfolios ",
        link: "/dashboard/landlord/portfolios",
        muiIcon: <HomeWorkIcon sx={muiIconStyle} />,
        description: "Create a new portfolio",
        icon: "fa fa-home",
        isSearchable: true,
        dataTestId: "landlord-portfolios-menu-item",
      },
    ],
  },
  {
    label: "Tenants",
    link: "/dashboard/landlord/tenants",
    icon: "fa fa-group",
    muiIcon: <PeopleAltIcon sx={muiIconStyle} />,
    description: "View your tenants",
    isSearchable: true,
    dataTestId: "landlord-tenants-menu-item",
  },

  {
    label: "Maintenance ",
    link: "/dashboard/landlord/maintenance-requests",
    muiIcon: <HandymanIcon sx={muiIconStyle} />,
    description: "View all maintenance requests",
    icon: "fas fa-tools",
    isSearchable: true,
    dataTestId: "landlord-maintenance-requests-menu-item",
  },
  {
    label: "Lease Agreements",
    link: "#",
    muiIcon: <DescriptionIcon sx={muiIconStyle} />,
    description: "View your lease terms",
    icon: "fas fa-user-circle",
    isSearchable: true,
    dataTestId: "landlord-lease-agreements-dropdown-menu-item",
    subMenuItems: [
      {
        label: "View Lease Agreements",
        link: "/dashboard/landlord/lease-agreements",
        muiIcon: <DescriptionIcon />,
        description: "View your lease agreements",
        icon: "fas fa-tools",
        isSearchable: true,
        dataTestId: "landlord-lease-agreements-menu-item",
      },
      {
        label: "New Lease Template",
        link: "/dashboard/landlord/lease-templates/create",
        muiIcon: <DescriptionIcon />,
        description: "Create a new lease agreement",
        icon: "fas fa-tools",
        isSearchable: true,
        dataTestId: "landlord-new-lease-template-menu-item",
      },
      {
        label: "Lease Templates",
        link: "/dashboard/landlord/lease-templates",
        muiIcon: <DescriptionIcon />,
        description: "View your lease terms",
        icon: "fas fa-user-circle",
        isSearchable: true,
        dataTestId: "landlord-lease-templates-menu-item",
      },
      {
        label: "Lease Cancellation Requests",
        link: "/dashboard/landlord/lease-cancellation-requests",
        muiIcon: <DescriptionIcon />,
        description: "View your lease cancellation requests",
        icon: "fas fa-user-circle",
        isSearchable: true,
        dataTestId: "landlord-lease-cancellation-requests-menu-item",
      },
      {
        label: "Lease Renewal Requests",
        link: "/dashboard/landlord/lease-renewal-requests",
        muiIcon: <DescriptionIcon />,
        description: "View your lease renewal requests",
        icon: "fas fa-user-circle",
        isSearchable: true,
        dataTestId: "landlord-lease-renewal-requests-menu-item",
      },
    ],
  },
  {
    label: "Rental Applications",
    link: "/dashboard/landlord/rental-applications",
    muiIcon: <ReceiptLongIcon sx={muiIconStyle} />,
    description: "View your rental applications",
    icon: "fas fa-tachometer-alt",
    isSearchable: true,
    dataTestId: "landlord-rental-applications-menu-item",
  },
  {
    label: "Finances",
    link: "#",
    icon: "fas fa-tachometer-alt",
    isSearchable: false,
    muiIcon: <AttachMoneyIcon sx={muiIconStyle} />,
    dataTestId: "landlord-finances-dropdown-menu-item",
    subMenuItems: [
      {
        label: "Transactions", //TODO: page for finances: income, expenses, transaction breakdowns, etc
        link: "/dashboard/landlord/transactions",
        icon: "fas fa-tools",
        isSearchable: true,
        dataTestId: "landlord-transactions-menu-item",
      },
      {
        label:"Billing Entries",
        link: "/dashboard/landlord/billing-entries",
        icon: "fas fa-tools",
        isSearchable: true,
        dataTestId: "landlord-billing-entries-menu-item",
      },
      {
        label: "Accounting", //TODO: page for accounting: taxes, etc
        link: "/dashboard/maintenance-requests/",
        icon: "fas fa-tools",
        isSearchable: false,
        dataTestId: "landlord-accounting-menu-item",
      },
    ],
  },
];
export const tenantMenuItems = [
  {
    label: "Dashboard",
    link: "/dashboard/tenant",
    icon: "fas fa-tachometer-alt",
    isSearchable: true,
    muiIcon: <DashboardIcon sx={muiIconStyle} />,
  },
  {
    label: "Maintenance Requests",
    link: "#",
    muiIcon: <HandymanIcon sx={muiIconStyle} />,
    subMenuItems: [
      {
        label: "Create New",
        link: "/dashboard/tenant/maintenance-requests/create",
        icon: "fas fa-tools",
        isSearchable: true,
      },
      {
        label: "View All",
        link: "/dashboard/tenant/maintenance-requests/",
        icon: "fas fa-tools",
        isSearchable: true,
      },
    ],
    icon: "fas fa-tools",
  },
  {
    label: "My Lease Agreement",
    link: "#",
    icon: "fas fa-user-circle",
    muiIcon: <DescriptionIcon sx={muiIconStyle} />,
    subMenuItems: [
      {
        label: "View Lease Agreement",
        link: "/dashboard/tenant/my-lease",
        icon: "fas fa-tools",
        isSearchable: true,
      },
      {
        label: "Lease Cancellation Requests",
        link: "/dashboard/tenant/lease-cancellation-requests",
        icon: "fas fa-tools",
        isSearchable: true,
      },
      {
        label: "Lease Renewal Requests",
        link: "/dashboard/tenant/lease-renewal-requests",
        icon: "fas fa-tools",
        isSearchable: true,
      },
    ],
    isSearchable: true,
  },
];

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
export const defaultWhiteInputStyle = {
  padding: "5px",
  width: "100%",
  borderRadius: "5px",
  background: "white",
  outline: "none",
  border: "none",
};
export const fakeData = {
  fakeFirstName:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.person.firstName(),
  fakeLastName:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.person.lastName(),
  fakeEmail:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.internet.email(),
  fakePassword:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.internet.password(),
  fakePhoneNumber:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.phone.number("###-###-####"),
  fakeAddress:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.address.streetAddress(),
  fakeCity:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.address.city(),
  fakeState:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.address.state(),
  fakeZipCode:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.address.zipCode(),
  fakeCountry:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.address.country(),
  fakeCompanyName:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.company.name(),
  fakePosition:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.name.jobTitle(),
  fakePastDate:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.date.past().toISOString().split("T")[0],
  fakeFutureDate:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.date.future().toISOString().split("T")[0],
  fakeFinanceAmount:
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.finance.amount(),
};
export function dateDiffForHumans(targetDate) {
  const currentDate = new Date();
  const timeDifference = targetDate - currentDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference === 0) {
    return "today";
  } else if (daysDifference === 1) {
    return "tomorrow";
  } else if (daysDifference === -1) {
    return "yesterday";
  } else if (daysDifference > 0) {
    return `in ${daysDifference} days`;
  } else {
    return `${-daysDifference} days ago`;
  }
}

export function addMonths(date, months) {
  const newDate = date.setMonth(date.getMonth() + months);
  return newDate;
}

export const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);

export const defaultUserProfilePicture =
  "/assets/img/avatars/default-user-profile-picture.png";
