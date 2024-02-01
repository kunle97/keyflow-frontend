import React from "react";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";

const BillingEntries = () => {
    const handleRowClick = (row) => {
        console.log(row);
    };
  return (
    <div className="container-fluid">
      <UITableMobile
        showCreate={true}
        createURL="/dashboard/landlord/billing-entries/create"
        tableTitle="Billing Entries"
        endpoint="/billing-entries/"
        createInfo={(row) =>
          `${
            row.type === "vendor_payment" || row.type === "expense"
              ? "-$"
              : "+$"
          }${String(row.amount).toLocaleString("en-US")}`
        }
        createSubtitle={(row) => `${removeUnderscoresAndCapitalize(row.type)}`}
        createTitle={(row) => `${new Date(row.timestamp).toLocaleDateString()}`}
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
