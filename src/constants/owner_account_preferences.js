/**
 * Owner Notification Settings
 * 
 * - Tenant Lease Agreement Signed (Owner)
 *   - Lease Cancellation Request Created (Owner)
 *   - Lease Renewal Request Created (Owner)
 *  - Lease Renewal Agreement Signed (Owner)
 *  - Rental Application Created For Unit (Owner)
 *  - (Stripe Invoice) Paid for Rent Payments, Security Deposits, etc.  (Owner)
 * -  New Tenant Completes Registration After Signing Lease (Owner)
 * 
 */

export const defaultOwnerAccountPreferences = [
    {
      type: "notifications",
      hidden: false,
      name: "tenant_lease_agreement_signed",
      label: "Tenant Lease Agreement Signed",
      values: [
        { name: "push", value: true, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: true, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant signs a lease agreement"
    },
    {
      type: "notifications",
      hidden: false,
      name: "lease_cancellation_request_created",
      label: "Lease Cancellation Request Created",
      values: [
        { name: "push", value: true, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: true, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant creates a lease cancellation request"
    },
    {
      type: "notifications",
      hidden: false,
      name: "lease_renewal_request_created",
      label: "Lease Renewal Request Created",
      values: [
        { name: "push", value: true, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: true, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant creates a lease renewal request"
    },
    {
      type: "notifications",
      hidden: false,
      name: "lease_renewal_agreement_signed",
      label: "Lease Renewal Agreement Signed",
      values: [
        { name: "push", value: true, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: true, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant signs a lease renewal agreement"
    },
    {
      type: "notifications",
      hidden: false,
      name: "rental_application_created",
      label: "Rental Application Created",
      values: [
        { name: "push", value: true, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: true, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant creates a rental application"
    },
    {
      type: "notifications",
      hidden: false,
      name: "invoice_paid",
      label: "Invoice Paid",
      values: [
        { name: "push", value: true, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: true, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant pays an invoice"
    },
    {
      type: "notifications",
      hidden: false,
      name: "new_tenant_registration_complete",
      label: "New Tenant Registration Complete",
      values: [
        { name: "push", value: true, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: true, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a new tenant completes registration"
    },
    {
      type: "notifications",
      hidden: false,
      name: "message_received",
      label: "Messages Received",
      values: [
        { name: "push", value: true, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: true, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a new message is recieved"
    },
  ];
  