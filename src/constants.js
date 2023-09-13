import { faker } from "@faker-js/faker";
import { loadStripe } from "@stripe/stripe-js";
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
export const uiRed = "#FF4040";
export const uiGrey1 = "#2c3a4a";
export const uiGrey2 = "#364658";

export const validationMessageStyle = {
  color: "red",
  fontSize: "14px",
};

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
  { label: "Properties", link: "/dashboard/properties", icon: "fa fa-home" },
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
  fakeFirstName: faker.person.firstName(),
  fakeLastName: faker.person.lastName(),
  fakeEmail: faker.internet.email(),
  fakePassword: faker.internet.password(),
  fakePhoneNumber: faker.phone.number("###-###-####"),
  fakeAddress: faker.address.streetAddress(),
  fakeCity: faker.address.city(),
  fakeState: faker.address.state(),
  fakeZipCode: faker.address.zipCode(),
  fakeCountry: faker.address.country(),
  fakeCompanyName: faker.company.name(),
  fakePosition: faker.name.jobTitle(),
  fakePastDate: faker.date.past().toISOString().split("T")[0],
  fakeFutureDate: faker.date.future().toISOString().split("T")[0],
  fakeFinanceAmount: faker.finance.amount(),
};

export function addMonths(date, months) {
  const newDate = date.setMonth(date.getMonth() + months);
  return newDate;
}

export const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);
