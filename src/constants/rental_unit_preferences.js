export const defaultRentalUnitPreferences  = [
    {
        type: "unit_preferences",
        hidden: false,
        label: "Accept Rental Applications",
        name: "accept_rental_applications",
        inputType: "switch",
        value: true,
        description: "Indicates if the landlord is accepting rental applications for this unit",
    },
    {
        type: "unit_preferences",
        hidden: false,
        label: "Accept Lease Renewals",
        name: "accept_lease_renewals",
        inputType: "switch",
        value: true,
        description: "Indicates if the landlord is accepting lease renewals for this unit",
    },
    {
        type: "unit_preferences",
        hidden: false,
        label: "Accept Lease Cancellations",
        name: "accept_lease_cancellations",
        inputType: "switch",
        value: true,
        description: "Indicates if the landlord is accepting lease cancellations for this unit",
    },

];
