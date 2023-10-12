import React from "react";
import UITable from "../UIComponents/UITable/UITable";

const Notifications = () => {
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
      label: "Time",
      name: "timestamp",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];
  return (
    <div>
      <UITable
        endpoint="/notifications/"
        columns={columns}
        title="Notification Center"
        detailURL="/dashboard/landlord/notifications/"
        showCreate={false}
      />
    </div>
  );
};

export default Notifications;
