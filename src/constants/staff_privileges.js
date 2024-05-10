//Create multiple staff_privilege with type staff_Privellage setting for access to
export const defaultStaffAccountPrivileges = [
  {
    type: "staff_privilege",
    hidden: false,
    name: "all_permissions",
    label: "All Permissions",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions  for all resources",
  },
  {
    type: "staff_privilege",
    hidden: false,
    name: "rental_assignments",
    label: "Rental Assignments",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to the rental units, rental properties or portolios that the staff has been assigned to",
  },
  {
    type: "staff_privilege",
    hidden: false,
    name: "billing_entries",
    label: "Billing Entries",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to billing entries",
  },
  //Create privellage for staff_invites
  {
    type: "staff_privilege",
    hidden: false,
    name: "staff_invites",
    label: "Staff Invites",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to staff invites",
  },

  //Create privellage for lease agreements
  {
    type: "staff_privilege",
    hidden: false,
    name: "lease_agreements",
    label: "Lease Agreements",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to lease agreements",
  },

  //Create privellage for lease renewals
  {
    type: "staff_privilege",
    hidden: false,
    name: "lease_renewal",
    label: "Lease Renewals",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to lease renewals",
  },
  //Create privellage for lease cancellation requests
  {
    type: "staff_privilege",
    hidden: false,
    name: "lease_cancellation",
    label: "Lease Cancellations",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to lease cancellations",
  },
  //Create privellage for maintenance requests
  {
    type: "staff_privilege",
    hidden: false,
    name: "maintenance_requests",
    label: "Maintenance Requests",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to maintenance requests",
  },
  //Create privellage for rental applications
  {
    type: "staff_privilege",
    hidden: false,
    name: "rental_applications",
    label: "Rental Applications",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to rental applications",
  },

  //Create privellage for Announcements
  {
    type: "staff_privilege",
    hidden: false,
    name: "announcements",
    label: "Announcements",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to announcements",
  },

  //Create privellage for lease templates
  {
    type: "staff_privilege",
    hidden: false,
    name: "lease_templates",
    label: "Lease Templates",
    values: [
      { name: "view", value: false, inputType: "switch", label: "View" },
      { name: "edit", value: false, inputType: "switch", label: "Edit" },
      { name: "delete", value: false, inputType: "switch", label: "Delete" },
      { name: "add", value: false, inputType: "switch", label: "Add" },
    ],
    description:
      "Enable or disable access and specific actions to lease templates",
  },
];
