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
      />
    </div>
  );
};

export default BillingEntries;
