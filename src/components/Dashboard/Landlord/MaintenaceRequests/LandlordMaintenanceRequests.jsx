import React from "react";
import { useEffect } from "react";
import {
  deleteMaintenanceRequest,
  getMaintenanceRequestsByLandlord,
} from "../../../../api/api";
import { useState } from "react";
import MUIDataTable from "mui-datatables";
import UIButton from "../../UIComponents/UIButton";
import { useNavigate } from "react-router-dom";
import { uiGreen, uiRed } from "../../../../constants";
import TitleCard from "../../UIComponents/TitleCard";
import { Title } from "@mui/icons-material";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";

const LandlordMaintenanceRequests = () => {
  const navigate = useNavigate();
  let resolvedIssuesCount = 0;
  let inProgressIssuesCount = 0;
  let pendingIssuesCount = 0;

  //TODO: Display data on what properties/units have the most pending, respolved isues

  //Create a astate for the maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState(0);
  const [pendingIssues, setPendingIssues] = useState(0);
  const [inProgressIssues, setInProgressIssues] = useState(0);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [showDeleteError, setShowDeleteError] = useState(false);

  const columns = [
    { name: "id", label: "ID", options: { display: false } },
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
    const navlink = `/dashboard/landlord/maintenance-requests/${rowData}`;
    navigate(navlink);
    console.log(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: 'created_at',
      direction: 'desc'
    },
    onRowClick: handleRowClick,
    rowHover: true,
    //Create a delete function that will delete the maintenance request only if it is not in progress
    onRowsDelete: (rowsDeleted, newTableData) => {
      console.log(rowsDeleted);
      console.log(newTableData);
      let idsToDelete = [];
      rowsDeleted.data.map((row) => {
        //Check if the status is in progress
        if (maintenanceRequests[row.dataIndex].status === "in_progress") {
          setShowDeleteError(true);
          setDeleteErrorMessage(
            "One or more of the maintenance requests you have selected are in progress. You cannot delete a maintenance request that is in progress. Please mark it as completed first."
          );
          return false;
        } else {
          idsToDelete.push(maintenanceRequests[row.dataIndex].id);
        }
      });
      console.log(idsToDelete);
      idsToDelete.map((id) => {
        deleteMaintenanceRequest(id).then((res) => {
          console.log(res.data);
        });
      });
    },
  };

  useEffect(() => {
    //Retrieve the maintenance requests
    getMaintenanceRequestsByLandlord().then((res) => {
      console.log(res.data);
      setMaintenanceRequests(res.data);
      setResolvedIssues(
        res.data.filter((request) => {
          return request.status === "completed";
        }).length
      );
      setPendingIssues(
        res.data.filter((request) => {
          return request.status === "pending";
        }).length
      );
      setInProgressIssues(
        res.data.filter((request) => {
          return request.status === "in_progress";
        }).length
      );
    });
  }, []);

  return (
    <div>
      <h3 className="text-white mb-4">Maintainance Requests</h3>
      <div className="row">
        <div className="col-md-3 mb-4">
          <TitleCard
            title="Resolved Issues"
            value={resolvedIssues}
            icon={<i className="fas fa-chart-bar fa-2x text-gray-300" />}
            backgroundColor={uiGreen}
            subTextIcon={<i className="fas fa-arrow-up" />}
            subtext="5% since last month"
          />
        </div>
        <div className="col-md-3 mb-4">
          <TitleCard
            title="In Progress Issues"
            value={inProgressIssues}
            icon={<i className="fas fa-chart-bar fa-2x text-gray-300" />}
            backgroundColor={"#36abba"}
            subTextIcon={<i className="fas fa-arrow-up" />}
            subtext="5% since last month"
          />
        </div>
        <div className="col-md-3 mb-4">
          <TitleCard
            title="Pending Issues"
            value={pendingIssues}
            icon={<i className="fas fa-chart-bar fa-2x text-gray-300" />}
            backgroundColor={"#e5b940"}
            subTextIcon={<i className="fas fa-arrow-up" />}
            subtext="5% since last month"
          />
        </div>
      </div>
      <AlertModal
        open={showDeleteError}
        onClick={() => setShowDeleteError(false)}
        title="Error"
        message={deleteErrorMessage}
        btnText="Close"
      />
        <UITable
        columns={columns}
        options={options}
        endpoint="/maintenance-requests/"
        title="Maintenance Requests"
        showCreate={false}
        detailURL="/dashboard/landlord/maintenance-requests/"
      />
    </div>
  );
};

export default LandlordMaintenanceRequests;
