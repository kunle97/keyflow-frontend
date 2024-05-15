import React from "react";
import { useNavigate } from "react-router";
import UITableMobile from "../UIComponents/UITable/UITableMobile";
const Notifications = () => {
  const navigate = useNavigate();
  const columns = [
    { label: "Notification", name: "title" },
    { label: "Messasge", name: "message" },
    {
      label: "Read",
      name: "is_read",
      options: {
        customBodyRender: (value) => {
          return value ? "Yes" : "No";
        },
      },
    },
    {
      label: "Date",
      name: "timestamp",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "timestamp",
      direction: "desc",
    },
    onRowClick: (rowData, rowMeta) => {
      const navlink = `/dashboard/notifications/${rowData}`;
      navigate(navlink);
    },
  };
  return (
    <div className="container-fluid">
      {/* <UITable
        endpoint="/notifications/"
        columns={columns}
        options={options}
        title="Notification Center"
      /> */}
      <UITableMobile
        endpoint="/notifications/"
        tableTitle="Notification Center"
        orderingField="-timestamp"
        createInfo={(row) => {
          return row.title;
        }}
        createTitle={(row) => {
          return row.message;
        }}
        createSubtitle={(row) => {
          return new Date(row.timestamp).toLocaleDateString();
        }}
        onRowClick={(row) => {
          const navlink = `/dashboard/notifications/${row.id}`;
          navigate(navlink);
        }}
      />
    </div>
  );
};

export default Notifications;
