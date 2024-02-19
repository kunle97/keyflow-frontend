import React, { useState, useEffect } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router-dom";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
const LeaseCancellationRequests = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const handleRowClick = (row) => {
    const navlink = `/dashboard/landlord/lease-cancellation-requests/${row.id}/`;
    navigate(navlink);
  };

  const columns = [
    {
      name: "tenant",
      label: "Tenant",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          let output = "";
          if (value) {
            output = `${value.user.first_name} ${value.user.last_name}`;
          } else {
            output = "N/A";
          }
          return <span>{output}</span>;
        },
      },
    },
    {
      name: "rental_unit",
      label: "Unit",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    {
      name: "status",
      label: "Status",
    },
    {
      name: "created_at",
      label: "Date Created",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  const options = {
    isSelectable: false,
    onRowClick: handleRowClick,
  };

  return (
    <div className="container-fluid">
      {isMobile ? (
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
      ) : (
        <UITable
          columns={columns}
          options={options}
          endpoint={"/lease-cancellation-requests/"}
          title={"Lease Cancellation Requests"}
          menuOptions={[
            {
              name: "View",
              onClick: (row) => {
                const navlink = `/dashboard/landlord/lease-cancellation-requests/${row.id}`;
                navigate(navlink);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default LeaseCancellationRequests;
