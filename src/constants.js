import { faker } from "@faker-js/faker";
import { loadStripe } from "@stripe/stripe-js";
import { createTheme } from "react-data-table-component";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { jwtDecode } from "jwt-decode";

export const authUser = localStorage.getItem("authTokens")
  ? jwtDecode(localStorage.getItem("authTokens"))
  : {};

export const token = localStorage.getItem("authTokens")
  ? JSON.parse(localStorage.getItem("authTokens")).access
  : {};

export const stripe_onboarding_link = localStorage.getItem(
  "stripe_onboarding_link"
)
  ? localStorage.getItem("stripe_onboarding_link")
  : {};

//Colors - probably should use tailwind colors
export const uiGreen = "#3aaf5c"; //alt: "#06b474";
export const uiRed = "#FF4040";
export const uiGrey1 = "#2c3a4a";
export const uiGrey2 = "#364658";
export const uiGrey3 = "#dcdde3"; //Used to set background color of a read notification

export const validationMessageStyle = {
  color: "red !important",
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
export const landlordMenuItems = [
  {
    label: "Dashboard",
    link: "/dashboard/landlord",
    icon: "fas fa-tachometer-alt",
    muiIcon: <DashboardOutlinedIcon />,
    description: "View your dashboard",
    isSearchable: true,
  },
  {
    label: "Tenants",
    link: "/dashboard/landlord/tenants",
    icon: "fa fa-group",
    muiIcon: <PeopleAltOutlinedIcon />,
    description: "View your tenants",
    isSearchable: true,
  },
  {
    label: "Properties",
    link: "/dashboard/landlord/properties",
    muiIcon: <HomeWorkOutlinedIcon />,
    description: "View your properties",
    icon: "fa fa-home",
    isSearchable: true,
  },
  {
    label: "Maintenance ",
    link: "/dashboard/landlord/maintenance-requests",
    muiIcon: <HandymanOutlinedIcon />,
    description: "View all maintenance requests",
    icon: "fas fa-tools",
    isSearchable: true,
  },
  {
    label: "Lease Agreements",
    link: "/dashboard/landlord/lease-templates",
    muiIcon: <DescriptionOutlinedIcon />,
    description: "View your lease terms",
    icon: "fas fa-user-circle",
    isSearchable: true,
    subMenuItems: [
      {
        label: "View Lease Agreements",
        link: "/dashboard/landlord/lease-agreements",
        muiIcon: <DescriptionOutlinedIcon />,
        description: "View your lease agreements",
        icon: "fas fa-tools",
        isSearchable: true,
      },
      {
        label: "New Lease Template",
        link: "/dashboard/landlord/lease-templates/create",
        muiIcon: <DescriptionOutlinedIcon />,
        description: "Create a new lease agreement",
        icon: "fas fa-tools",
        isSearchable: true,
      },
      {
        label: "Lease Templates",
        link: "/dashboard/landlord/lease-templates",
        muiIcon: <DescriptionOutlinedIcon />,
        description: "View your lease terms",
        icon: "fas fa-user-circle",
        isSearchable: true,
      },
      {
        label: "Lease Cancellation Requests",
        link: "/dashboard/landlord/lease-cancellation-requests",
        muiIcon: <DescriptionOutlinedIcon />,
        description: "View your lease cancellation requests",
        icon: "fas fa-user-circle",
        isSearchable: true,
      },
      {
        label: "Lease Renewal Requests",
        link: "/dashboard/landlord/lease-renewal-requests",
        muiIcon: <DescriptionOutlinedIcon />,
        description: "View your lease renewal requests",
        icon: "fas fa-user-circle",
        isSearchable: true, 
      }
    ],
  },
  {
    label: "Rental Applications",
    link: "/dashboard/landlord/rental-applications",
    muiIcon: <ReceiptLongOutlinedIcon />,
    description: "View your rental applications",
    icon: "fas fa-tachometer-alt",
    isSearchable: true,
  },
  {
    label: "Finances",
    link: "#",
    icon: "fas fa-tachometer-alt",
    isSearchable: false,
    subMenuItems: [
      {
        label: "Transactions", //TODO: page for finances: income, expenses, transaction breakdowns, etc
        link: "/dashboard/landlord/transactions",
        icon: "fas fa-tools",
        isSearchable: true,
      },
      {
        label: "Accounting", //TODO: page for accounting: taxes, etc
        link: "/dashboard/maintenance-requests/",
        icon: "fas fa-tools",
        isSearchable: false,
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
  },
  {
    label: "Maintenance Requests",
    link: "#",
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
      :  faker.date.past().toISOString().split("T")[0],
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
