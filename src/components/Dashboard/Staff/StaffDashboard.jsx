import React, { useEffect } from "react";
import UITableMiniCard from "../UIComponents/UICards/UITableMiniCard";
import { getStaffRentalAssignments } from "../../../api/staff";
import { staffData } from "../../../constants";
const StaffDashboard = () => {
  useEffect(() => {
    console.log("Staff Dataaa assignement typ chek ",JSON.parse(staffData.rental_assignments) );
    // getStaffRentalAssignments().then((res) => {
    //   console.log(res);
    // }, []);
    //TODO:
    //1. Fetch staff privellages
    //2. Fetach staff rental assignments
    //3. COnfigure Dashboard to display appropriate functions based on the staff privellages
  });
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-black">Tasks</h5>
            <p className="card-text text-black">
              View and manage tasks assigned to you.
            </p>
            <a href="/dashboard/staff/tasks" className="btn btn-primary">
              View Tasks
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
