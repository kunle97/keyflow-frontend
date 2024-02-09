import React from "react";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import { useNavigate } from "react-router";
import { uiGreen, uiRed } from "../../../../constants";
const BillingEntries = () => {
  const navigate = useNavigate();
  const handleRowClick = (row) => {
    navigate(`/dashboard/landlord/billing-entries/${row.id}`);
  };
  return (
    <div className="container-fluid">
      <UITableMobile
        showCreate={true}
        createURL="/dashboard/landlord/billing-entries/create"
        tableTitle="Billing Entries"
        endpoint="/billing-entries/"
        createInfo={(row) => `${removeUnderscoresAndCapitalize(row.type)}`}
        createSubtitle={(row) =>
          `$${String(row.amount).toLocaleString("en-US")}`
        }
        createTitle={(row) => {
          return (
            <span
              style={{
                color: row.status === "paid" ? uiGreen : uiRed,
                textTransform: "capitalize",
              }}
            >
              {row.status}
            </span>
          );
        }}
        onRowClick={handleRowClick}
        orderingFields={[
          { field: "created_at", label: "Date Created (Ascending)" },
          { field: "-created_at", label: "Date Created (Descending)" },
          { field: "type", label: "Transaction Type (Ascending)" },
          { field: "-type", label: "Transaction Type (Descending)" },
          { field: "amount", label: "Amount (Ascending)" },
          { field: "-amount", label: "Amount (Descending)" },
        ]}
        testRowIdentifier={`billing-entries-table-row`}
        createTestRowIdentifier={(row) => {
          let identifier = "";
          if (
            row.type === "revenue" ||
            row.type === "rent_payment" ||
            row.type === "late_fee" ||
            row.type === "security_deposit" ||
            row.type === "application_fee" ||
            row.type === "maintenance_fee"
          ) {
            identifier = "billing-entries-table-revenue-row";
          } else if (row.type === "expense" || row.type === "vendor_payment") {
            identifier = "billing-entries-table-expense-row";
          }
          return identifier;
        }}
      />
    </div>
  );
};

export default BillingEntries;