import React from "react";
import { useEffect } from "react";
import {
  getMaintenanceRequestsByLandlord,
  getProperty,
} from "../../../../api/api";
import { useState } from "react";
import MUIDataTable from "mui-datatables";
import UIButton from "../../UIButton";
import { useNavigate } from "react-router-dom";
import { faker } from "@faker-js/faker";
import { uiGreen, uiRed } from "../../../../constants";

const LandlordMaintenanceRequests = () => {
  const navigate = useNavigate();
  let resolvedIssuesCount = 0;
  let pendingIssuesCount = 0;

  //TODO: Display data on what properties/units have the most pending, respolved isues

  //Create a astate for the maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState(0);
  const [pendingIssues, setPendingIssues] = useState(0);
  const columns = [
    { name: "id", label: "ID", options: { display: false } },
    { name: "description", label: "Issue" },
    { name: "type", label: "Type" },
    {
      name: "created_at",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
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
  ];

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/maintenance-requests/${rowData[0]}`;
    navigate(navlink);
    console.log(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    rowHover: true,
  };

  useEffect(() => {
    //Retrieve the maintenance requests
    getMaintenanceRequestsByLandlord().then((res) => {
      console.log(res.data);
      setMaintenanceRequests(res.data);
      setResolvedIssues(res.data.filter((request) => {return request.is_resolved === true}).length); 
      setPendingIssues(res.data.filter((request) => {return request.is_resolved === false}).length);
    });
  }, []);

  return (
    <div>
      <h3 className="text-white mb-4">Maintainance Requests</h3>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div
            className="card text-white shadow"
            style={{ background: uiGreen }}
          >
            <div className="card-body">
              <div className="row mb-2">
                <div className="col">
                  <p className="m-0">Resolved Issues</p>
                  <p className="m-0">
                    <strong>{resolvedIssues}</strong>
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-bar fa-2x text-gray-300" />
                </div>
              </div>
              <p className="text-white-50 small m-0">
                <i className="fas fa-arrow-up" />
                &nbsp;5% since last month
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-white shadow" style={{ background: uiRed }}>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col">
                  <p className="m-0">Pending Issues</p>
                  <p className="m-0">
                    <strong>{pendingIssues}</strong>
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-bar fa-2x text-gray-300" />
                </div>
              </div>
              <p className="text-white-50 small m-0">
                <i className="fas fa-arrow-up" />
                &nbsp;5% since last month
              </p>
            </div>
          </div>
        </div>
      </div>
      <MUIDataTable
        title={"Maintenance Requests"}
        columns={columns}
        data={maintenanceRequests}
        options={options}
      />
    </div>
  );
};

export default LandlordMaintenanceRequests;
