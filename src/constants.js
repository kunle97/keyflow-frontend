import { faker } from "@faker-js/faker";
import { createMuiTheme } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { createTheme } from "react-data-table-component";
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
export const uiRed = "#FF4040";
export const uiGrey1 = "#2c3a4a";
export const uiGrey2 = "#364658";

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

export const landlordMenuItems = [
  {
    label: "Dashboard",
    link: "/dashboard/landlord",
    icon: "fas fa-tachometer-alt",
  },
  {
    label: "Tenants",
    link: "/dashboard/landlord/tenants",
    icon: "fa fa-group",
  },
  { label: "Properties", link: "/dashboard/landlord/properties", icon: "fa fa-home" },
  {
    label: "Maintenance Requests",
    link: "/dashboard/landlord/maintenance-requests",
    icon: "fas fa-tools",
  },
  {
    label: "Lease Agreements",
    link: "/dashboard/landlord",
    icon: "fas fa-user-circle",
    subMenuItems: [
      {
        label: "Create New",
        link: "/dashboard/landlord/lease-agreements/create",
        icon: "fas fa-tools",
      },
      {
        label: "Lease Terms",
        link: "/dashboard/landlord/lease-terms",
        icon: "fas fa-user-circle",
      },
    ],
  },
  {
    label: "Rental Applications",
    link: "/dashboard/landlord/rental-applications",
    icon: "fas fa-tachometer-alt",
  },
  {
    label: "Finances",
    link: "#",
    icon: "fas fa-tachometer-alt",
    subMenuItems: [
      {
        label: "Transactions", //TODO: page for finances: income, expenses, transaction breakdowns, etc
        link: "/dashboard/landlord/transactions",
        icon: "fas fa-tools",
      },
      {
        label: "Accounting", //TODO: page for accounting: taxes, etc
        link: "/dashboard/maintenance-requests/",
        icon: "fas fa-tools",
      },
    ],
  },
];
export const tenantMenuItems = [
  {
    label: "Dashboard",
    link: "/dashboard/tenant",
    icon: "fas fa-tachometer-alt",
  },
  {
    label: "Maintenance Requests",
    link: "#",
    subMenuItems: [
      {
        label: "Create New",
        link: "/dashboard/tenant/maintenance-requests/create",
      },
      {
        label: "View All",
        link: "/dashboard/tenant/maintenance-requests/",
      },
    ],
    icon: "fas fa-tools",
  },
  {
    label: "My Lease Agreement",
    link: "/dashboard/tenant/my-lease",
    icon: "fas fa-user-circle",
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

export const fakeData = {
  fakeFirstName:  process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.person.firstName(),
  fakeLastName: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.person.lastName(),
  fakeEmail: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.internet.email(),
  fakePassword: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.internet.password(),
  fakePhoneNumber: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.phone.number("###-###-####"),
  fakeAddress: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.address.streetAddress(),
  fakeCity: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.address.city(),
  fakeState: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.address.state(),
  fakeZipCode: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.address.zipCode(),
  fakeCountry: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.address.country(),
  fakeCompanyName: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.company.name(),
  fakePosition: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.name.jobTitle(),
  fakePastDate: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.date.past().toISOString().split("T")[0],
  fakeFutureDate: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.date.future().toISOString().split("T")[0],
  fakeFinanceAmount: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.amount(),
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
