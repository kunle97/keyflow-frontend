import React from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { uiGreen, uiRed } from "../../../../constants";
import { useNavigate } from "react-router";
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
    <div className="container-fluid" >
      <UITable
        columns={columns}
        endpoint={"/lease-agreements/"}
        options={options}
        title={"Lease Agreements"}
      />
    </div>
  );
};

export default ViewLeaseAgreements;
