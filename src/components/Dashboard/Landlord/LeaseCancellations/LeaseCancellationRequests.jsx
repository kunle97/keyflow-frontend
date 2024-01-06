import React, { useState, useEffect } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router-dom";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
const LeaseCancellationRequests = () => {
  const navigate = useNavigate();
  const handleRowClick = (row) => {
    const navlink = `/dashboard/landlord/lease-cancellation-requests/${row.id}/`;
    navigate(navlink);
  };
  return (
    <div className="container-fluid">

      <UITableMobile
        endpoint={"/lease-cancellation-requests/"}
        tableTitle={"Lease Cancellation Requests"}
        createInfo={(row) =>
          `${row.tenant.user.first_name} ${row.tenant.user.last_name}`
        }
        createTitle={(row) =>
          `Unit ${row.rental_unit.name} | ${row.rental_property.name}`
        }
        createSubtitle={(row) => `${row.status}`}
        orderingFields={[
          { field: "created_at", label: "Date Created (Ascending)" },
          { field: "-created_at", label: "Date Created (Descending)" },
          { field: "status", label: "Status (Ascending)" },
          { field: "-status", label: "Status (Descending)" },
        ]}
        onRowClick={handleRowClick}
        loadingTitle="Lease Cancellation Requests"
        loadingMessage="Please wait while we fetch your lease cancellation requests."
      />
    </div>
  );
};

export default LeaseCancellationRequests;
