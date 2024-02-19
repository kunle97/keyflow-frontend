import React from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router-dom";
import BackButton from "../../UIComponents/BackButton";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
const LeaseRenewalRequests = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const columns = [
    {
      name: "tenant",
      label: "Tenant",
      options: {
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
  const handleRowClick = (row) => {
    const navlink = `/dashboard/landlord/lease-renewal-requests/${row.id}/`;
    navigate(navlink);
  };
  const options = {
    isSelectable: false,
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
    <div className="container-fluid">
      {isMobile ? (
        <UITableMobile
          endpoint={"/lease-renewal-requests/"}
          tableTitle={"Lease Renewal Requests"}
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
          loadingTitle="Lease renewal Requests"
          loadingMessage="Please wait while we fetch your lease renewal requests."
        />
      ) : (
        <UITable
          columns={columns}
          options={options}
          endpoint={"/lease-renewal-requests/"}
          title={"Lease Renewal Requests"}
          menuOptions={[
            {
              name: "View",
              onClick: (row) => {
                const navlink = `/dashboard/landlord/lease-renewal-requests/${row.id}`;
                navigate(navlink);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default LeaseRenewalRequests;
