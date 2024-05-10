/**
 * Landlord Notification Settings
 * 
 * - Tenant Lease Agreement Signed (Landlord)
 *   - Lease Cancellation Request Created (Landlord)
 *   - Lease Renewal Request Created (Landlord)
 *  - Lease Renewal Agreement Signed (Landlord)
 *  - Rental Application Created For Unit (Landlord)
 *  - (Stripe Invoice) Paid for Rent Payments, Security Deposits, etc.  (Landlord)
 * -  New Tenant Completes Registration After Signing Lease (Landlord)
 * 
 */

export const defaultLandlordAccountPreferences = [
    {
      type: "notifications",
      hidden: false,
      name: "tenant_lease_agreement_signed",
      label: "Tenant Lease Agreement Signed",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant signs a lease agreement"
    },
    {
      type: "notifications",
      hidden: false,
      name: "lease_cancellation_request_created",
      label: "Lease Cancellation Request Created",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant creates a lease cancellation request"
    },
    {
      type: "notifications",
      hidden: false,
      name: "lease_renewal_request_created",
      label: "Lease Renewal Request Created",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant creates a lease renewal request"
    },
    {
      type: "notifications",
      hidden: false,
      name: "lease_renewal_agreement_signed",
      label: "Lease Renewal Agreement Signed",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant signs a lease renewal agreement"
    },
    {
      type: "notifications",
      hidden: false,
      name: "rental_application_created",
      label: "Rental Application Created",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant creates a rental application"
    },
    {
      type: "notifications",
      hidden: false,
      name: "invoice_paid",
      label: "Invoice Paid",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a tenant pays an invoice"
    },
    {
      type: "notifications",
      hidden: false,
      name: "new_tenant_registration_complete",
      label: "New Tenant Registration Complete",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a new tenant completes registration"
    },
    {
      type: "notifications",
      hidden: false,
      name: "new_staff_registration_complete",
      label: "New Staff Registration Complete",
      values: [
        { name: "push", value: false, inputType: "switch", label: "Push Notifications" },
        { name: "email", value: false, inputType: "switch", label: "Email Notifications" }
      ],
      description: "Enable or disable notifications for when a new staff completes registration"
    },
  ];
  