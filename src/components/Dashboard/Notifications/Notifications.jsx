import React from "react";
import UITable from "../UIComponents/UITable/UITable";
import { useNavigate } from "react-router";
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
      const navlink = `/dashboard/landlord/notifications/${rowData}`;
      navigate(navlink);
    },
  };
  return (
    <div className="container-fluid">
      <UITable
        endpoint="/notifications/"
        columns={columns}
        options={options}
        title="Notification Center"
      />
    </div>
  );
};

export default Notifications;
