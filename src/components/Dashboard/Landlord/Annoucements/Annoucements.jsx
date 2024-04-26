import React from "react";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { useNavigate } from "react-router";
import useScreen from "../../../../hooks/useScreen";
import { getUnit } from "../../../../api/units";

const Annoucements = () => {
  const navigate = useNavigate();
  const handleRowClick = (row) => {
    navigate(`/dashboard/landlord/announcements/${row.id}`);
  };
  const { isMobile } = useScreen();
  const columns = [
    {
      name: "title",
      label: "Title",
      options: {
        customBodyRender: (value) => {
          return value;
        },
      },
    },
    {
      name: "start_date",
      label: "Start Date",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
    },
    {
      name: "end_date",
      label: "End Date",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
    },
    {
      name: "target_object",
      label: "Target",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          console.log(value);
          return `${value.type} - ${value.name}`;
        },
      },
    },
  ];
  const options = {
    isSelectable: false,
  };

  return (
    <div className="container-fluid">
      {isMobile ? (
        <UITableMobile
          showCreate={true}
          createURL="/dashboard/landlord/announcements/create"
          tableTitle="Announcements"
          endpoint="/announcements/"
          createInfo={(row) => `${row.title}`}
          createSubtitle={(row) => `${row.body}`}
          createTitle={(row) => {
            return <span>{new Date(row.created_at).toLocaleDateString()}</span>;
          }}
          onRowClick={handleRowClick}
        />
      ) : (
        <UITable
          showCreate={true}
          createURL="/dashboard/landlord/announcements/create"
          title="Announcements "
          columns={columns}
          options={options}
          handleRowClick={handleRowClick}
          endpoint="/announcements/"
          menuOptions={[
            {
              name: "View",
              onClick: (row) => {
                navigate(`/dashboard/landlord/announcements/${row.id}`);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default Annoucements;
