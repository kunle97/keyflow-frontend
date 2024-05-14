export const defaultPortfolioPreferences = [
    {
        type: "portfolio_preferences",
        hidden: false,
        label: "Accept Rental Applications",
        name: "accept_rental_applications",
        inputType: "switch",
        value: true,
        description: "Indicates if the owner is accepting rental applications for this portfolio",
    },
    {
        type: "portfolio_preferences",
        hidden: false,
        label: "Accept Lease Renewals",
        name: "accept_lease_renewals",
        inputType: "switch",
        value: true,
        description: "Indicates if the owner is accepting lease renewals for this portfolio",
    },
    {
        type: "portfolio_preferences",
        hidden: false,
        label: "Accept Lease Cancellations",
        name: "accept_lease_cancellations",
        inputType: "switch",
        value: true,
        description: "Indicates if the owner is accepting lease cancellations for this portfolio",
    },
];
