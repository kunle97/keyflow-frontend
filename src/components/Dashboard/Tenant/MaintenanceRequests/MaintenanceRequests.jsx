import React from "react";
import { useEffect } from "react";
import { getMaintenanceRequestsByUser } from "../../../../api/api";
import { useState } from "react";
import MUIDataTable from "mui-datatables";

const MaintenanceRequests = () => {
  //Create a astate for the maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const columns = [
    { name: "id", label: "ID", options: { display: false } },
    { name: "description", label: "Issue" },
    { name: "type", label: "Type" },
    {
      name: "is_resolved",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === true) {
            return <span className="text-success">Resolved</span>;
          } else {
            return <span className="text-danger">Pending</span>;
          }
        },
      },
    },
    {
      name: "created_at",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  const handleRowClick = (rowData, rowMeta) => {
    // const navlink = `/dashboard/landlord/`;
    // navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    // onRowClick: handleRowClick,
  };

  useEffect(() => {
    //Retrieve the maintenance requests
    getMaintenanceRequestsByUser().then((res) => {
      console.log(res.data);
      setMaintenanceRequests(res.data);
    });
  }, []);

  return (
    <div>
      <h3 className="text-white mb-4">Maintainance Requests</h3>
      <MUIDataTable
        title={"Maintenance Requests"}
        columns={columns}
        data={maintenanceRequests}
        options={options}
      />
    </div>
  );
};

export default MaintenanceRequests;
