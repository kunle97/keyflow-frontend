export const defaultPortfolioPreferences = [
  {
    type: "portfolio_preferences",
    hidden: false,
    label: "Accept Rental Applications",
    name: "accept_rental_applications",
    inputType: "switch",
    value: true,
    description:
      "Indicates if the owner is accepting rental applications for this portfolio",
  },
  {
    type: "portfolio_preferences",
    hidden: false,
    label: "Accept Lease Renewals",
    name: "accept_lease_renewals",
    inputType: "switch",
    value: true,
    description:
      "Indicates if the owner is accepting lease renewals for this portfolio",
  },
  {
    type: "portfolio_preferences",
    hidden: false,
    label: "Accept Lease Cancellations",
    name: "accept_lease_cancellations",
    inputType: "switch",
    value: true,
    description:
      "Indicates if the owner is accepting lease cancellations for this portfolio",
  },
  {
    type: "unit_preferences",
    hidden: false,
    label: "Allow Lease Auto Renewal",
    name: "allow_lease_auto_renewal",
    inputType: "switch",
    value: true,
    description:
      "Indicates if the owner is allowing tenants in subsequent units to enable auto renewal of their lease",
  },
];
