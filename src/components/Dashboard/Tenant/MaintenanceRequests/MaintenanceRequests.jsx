import React from "react";
import { useEffect } from "react";
import { getMaintenanceRequestsByUser } from "../../../../api/maintenance_requests";
import { useState } from "react";
import MUIDataTable from "mui-datatables";
import UITable from "../../UIComponents/UITable/UITable";
import { getTenantDashboardData } from "../../../../api/tenants";
import UIPrompt from "../../UIComponents/UIPrompt";
import { uiGreen } from "../../../../constants";
import DescriptionIcon from "@mui/icons-material/Description";

const MaintenanceRequests = () => {
  //Create a astate for the maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const columns = [
    { name: "description", label: "Issue" },
    { name: "type", label: "Type" },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === "pending") {
            return <span className="text-warning">Pending</span>;
          } else if (value === "in_progress") {
            return <span className="text-info">In Progress</span>;
          } else if (value === "completed") {
            return <span className="text-success">Completed</span>;
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
      sort: true,
    },
  ];

  const handleRowClick = (rowData, rowMeta) => {
    // const navlink = `/dashboard/landlord/`;
    // navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    // onRowsDelete: (rowsDeleted, data) => {
    //   console.log(rowsDeleted);
    //   //Create an array to hold the ids of the rows to be deleted
    //   const idsToDelete = [];
    //   //Loop through the rows to be deleted and push the ids to the idsToDelete array
    //   rowsDeleted.data.map((row) => {
    //     idsToDelete.push(maintenanceRequests[row.dataIndex].id);
    //   });
    //   //Call the delete properties api function and pass the idsToDelete array
    //   idsToDelete.map((id) => {
    //     deleteMaintenanceRequest(id).then((res) => {
    //       console.log(res);
    //       //If the delete was successful, remove the deleted rows from the properties state
    //       const newMaintenanceRequests = maintenanceRequests.filter(
    //         (maintenanceRequest) => maintenanceRequest.id !== id
    //       );
    //       setMaintenanceRequests(newMaintenanceRequests);
    //     });
    //   });
    // },
  };

  useEffect(() => {
    //Retrieve the maintenance requests
    getTenantDashboardData().then((res) => {
      //Check if lease agreement is active
      console.log(res);
      setLeaseAgreement(res.lease_agreement);
      if (res.lease_agreement) {
        getMaintenanceRequestsByUser().then((res) => {
          console.log(res);
          setMaintenanceRequests(res);
        });
      }
    });
  }, []);

  return (
    <div>
      {leaseAgreement ? (
        <UITable
          title={"Maintenance Requests"}
          columns={columns}
          data={maintenanceRequests}
          options={options}
        />
      ) : (
        <UIPrompt
          icon={<DescriptionIcon sx={{ fontSize: 45, color: uiGreen }} />}
          title="No Active Lease Agreement"
          message="You need to have an active lease agreement to view your maintenance requests."
          btnText="Okay"
        />
      )}
    </div>
  );
};

export default MaintenanceRequests;
