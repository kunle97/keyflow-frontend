import React, { useState, useEffect } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router-dom";
const LeaseCancellationRequests = () => {
  const navigate = useNavigate();
  const columns = [
    { name: "id", label: "ID" },
    {
      name: "tenant",
      label: "Tenant",
      options: {
        customBodyRender: (value) => {
          let output = "";
          if (value) {
            output = `${value.first_name} ${value.last_name}`;
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
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    {
      name: "rental_property",
      label: "Property",
      options: {
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    { name: "status", label: "Status" },
    {
      name: "request_date",
      label: "Date Requested",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
    {
      name: "created_at",
      label: "Date Submitted",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/lease-cancellation-requests/${rowData}/`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: handleRowClick,
    //CREate a function to handle the row delete
  };
  return (
    <div>
      <UITable
        title="Lease Cancellation Requests"
        endpoint={"/lease-cancellation-requests/"}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default LeaseCancellationRequests;
