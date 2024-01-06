import React from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { uiGreen, uiRed } from "../../../../constants";
import { useNavigate } from "react-router";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
const ViewLeaseAgreements = () => {
  const navigate = useNavigate();
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
      name: "is_active",
      label: "Active",
      options: {
        customBodyRender: (value) => {
          return value ? (
            <span style={{ color: uiGreen }}>Active</span>
          ) : (
            <span style={{ color: uiRed }}>Inactive</span>
          );
        },
      },
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

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/lease-agreements/${rowData}`;
    navigate(navlink);
  };

  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    isSelectable: false,
    onRowClick: handleRowClick,
  };
  return (
    <div className="container-fluid">
      {/* <UITable
        columns={columns}
        endpoint={"/lease-agreements/"}
        options={options}
        title={"Lease Agreements"}
      /> */}
      <UITableMobile
        tableTitle={"Lease Agreements"}
        endpoint={"/lease-agreements/"}
        createInfo={(row) =>
          `${
            row.tenant
              ? row.tenant.user.first_name + row.tenant.user.last_name
              : "N/A"
          }`
        }
        createSubtitle={(row) =>
          `${row.is_active ? "Active" : "Inactive"} - Ends: ${
            row.end_date ? new Date(row.end_date).toLocaleDateString() : "N/A"
          }`
        }
        createTitle={(row) =>
          `Unit ${row.rental_unit.name}`
        }
        orderingFields={[
          { field: "created_at", label: "Date Created (Ascending)" },
          { field: "-created_at", label: "Date Created (Descending)" },
          { field: "is_active", label: "Status (Ascending)" },
          { field: "-is_active", label: "Status (Descending)" },
          { field: "tenant__last_name", label: "Tenant (Ascending)" },
          { field: "-tenant__last_name", label: "Tenant (Descending)" },
          { field: "start_date", label: "Start Date (Ascending)" },
          { field: "-start_date", label: "Start Date (Descending)" },
          { field: "end_date", label: "End Date (Ascending)" },
          { field: "-end_date", label: "End Date (Descending)" },
        ]}
        onRowClick={(row) => {
          const navlink = `/dashboard/landlord/lease-agreements/${row.id}`;
          navigate(navlink);
        }}
      />
    </div>
  );
};

export default ViewLeaseAgreements;
