import { CheckBox } from "@mui/icons-material";
import React from "react";
import { faker } from "@faker-js/faker";
const RentalHistorySection = (props) => {
  const {
    address,
    startDate,
    endDate,
    landlordName,
    landlordPhone,
    landlordEmail,
  } = props.residence;

  return (
    <div className="card mb-3">
      <div className="row card-body">
        <div className="col-md-12 mb-4">
          <label className="mb-2"> Address</label>
          <input
            className="form-control"
            name="address"
            value={address}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder=" Address"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={startDate}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Start Date"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">End Date</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={endDate}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="End Date"
          />
          <CheckBox /> Current Residence
        </div>
        <div className="col-md-12 mb-4">
          <label className="mb-2">Landlord Name</label>
          <input
            className="form-control"
            name="landlordName"
            value={landlordName}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Company Name"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Landlord Phone</label>
          <input
            className="form-control"
            name="landlordPhone"
            value={landlordPhone}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Landlord Phone"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Landlord Email</label>
          <input
            className="form-control"
            name="landlordEmail"
            value={landlordEmail}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Landlord Email"
          />
        </div>
        <div>{props.removeBtn}</div>
      </div>
    </div>
  );
};

export default RentalHistorySection;
