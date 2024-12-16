import React from "react";
import { useNavigate } from "react-router";
import UITableMobile from "../UIComponents/UITable/UITableMobile";
import UITable from "../UIComponents/UITable/UITable";
import useScreen from "../../../hooks/useScreen";
import { markNotificationAsRead } from "../../../api/notifications";
const Notifications = () => {
  const { isMobile } = useScreen();
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
      {isMobile ? (
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
            const resource_url = row.resource_url;
            navigate(resource_url);
          }}
        />
      ) : (
        <UITable
          dataTestId="notifications-table"
          testRowIdentifier="notifications-table-row"
          endpoint="/notifications/"
          columns={columns}
          options={options}
          defaultOrderingField="-timestamp"
          title="Notification Center"
          onRowClick={(row) => {
            navigate(`/dashboard/notifications/${row.id}`);
          }}
          menuOptions={[
            {
              name: "Mark as Read",
              hidden: (row) => {
                return row.is_read; // Show only if not already read
              },
              onClick: (row) => {
                markNotificationAsRead(row.id)
                  .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                      console.log("Marked as read");
                      navigate(0);
                    }
                  })
                  .catch((error) => {
                    console.error("Error marking as read", error);
                  });
              },
            },
            {
              name: "Details",
              onClick: (row) => {
                navigate(`/dashboard/notifications/${row.id}`);
              },
            },
            {
              name: "View Resource",
              onClick: (row) => {
                navigate(row.resource_url);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default Notifications;
