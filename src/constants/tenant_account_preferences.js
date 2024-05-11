/**
 * Tenant Account Preferences:
 * 
 * Cancellation Request Approved (Lease Agreement Cancelled) (Te
 * hidden:false,nant)

    Lease Cancellation Request Denied (Tenant)

    Lease Renewal Request Approved (Tenant)

    Lease Renewal Request Rejected (Tenant)

    Bill Created (Tenant)
 * 
 * */
export const defaultTenantAccountPreferences = [
    {
      type: "notifications",
      hidden:false,
      label: "Lease Agreement Signed",
      name: "lease_cancellation_request_approved",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a lease cancellation request is approved"
    },
    {
      type: "notifications",
      hidden:false,
      label: "Lease Agreement Signed",
      name: "lease_cancellation_request_denied",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a lease cancellation request is denied"
    },
    {
      type: "notifications",
      hidden:false,
      label: "Lease Agreement Signed",
      name: "lease_renewal_request_approved",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a lease renewal request is approved"
    },
    {
      type: "notifications",
      hidden:false,
      label: "Lease Renewal Request Rejected",
      name: "lease_renewal_request_rejected",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a lease renewal request is rejected"
    },
    {
      type: "notifications",
      hidden:false,
      label: "Lease Renewal Agreement Signed",
      name: "bill_created",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a bill is created"
    },
  ];