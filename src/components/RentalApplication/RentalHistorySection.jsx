import Checkbox from "@mui/material/Checkbox";
import React from "react";
import { validationMessageStyle } from "../../constants";

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
          <label className="mb-2">
            Full Address (Street, City, State, Zip)
          </label>
          <input
            {...props.register(`address_${props.id}`, {
              required: "This is a required field",
            })}
            className="form-control"
            name="address"
            value={address}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder=" Address"
          />
          <span style={validationMessageStyle}>
            {props.addressErrors && props.addressErrors.message}
          </span>
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Start Date</label>
          <input
            {...props.register(`startDate_${props.id}`, {
              required: "This is a required field",
            })}
            type="date"
            className="form-control"
            name="startDate"
            value={startDate}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Start Date"
          />
          <span style={validationMessageStyle}>
            {props.startDateErrors && props.startDateErrors.message}
          </span>
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">End Date</label>
          <input
            {...props.register(`endDate_${props.id}`, {
              required: "This is a required field",
            })}
            type="date"
            className="form-control"
            name="endDate"
            value={endDate}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="End Date"
          />
          <Checkbox /> Current Residence
        </div>
        <div className="col-md-12 mb-4">
          <label className="mb-2">Landlord Name</label>
          <input
            {...props.register(`landlordName_${props.id}`, {
              required: "This is a required field",
            })}
            className="form-control"
            name="landlordName"
            value={landlordName}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Company Name"
          />
          <span style={validationMessageStyle}>
            {props.landlordNameErrors && props.landlordNameErrors.message}
          </span>
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Landlord Phone</label>
          <input
            {...props.register(`landlordPhone_${props.id}`, {
              required: "This is a required field",
              pattern: {
                value: /\d{3}-\d{3}-\d{4}/,
                message: "Please enter a valid phone number",
              },
            })}
            className="form-control"
            name="landlordPhone"
            value={landlordPhone}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Landlord Phone"
          />
          <span style={validationMessageStyle}>
            {props.landlordPhoneErrors && props.landlordPhoneErrors.message}
          </span>
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Landlord Email</label>
          <input
            {...props.register(`landlordEmail_${props.id}`, {
              required: "This is a required field",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
            })}
            className="form-control"
            name="landlordEmail"
            value={landlordEmail}
            onChange={props.onResidenceChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Landlord Email"
          />
          <span style={validationMessageStyle}>
            {props.landlordEmailErrors && props.landlordEmailErrors.message}
          </span>
        </div>
        <div>{props.removeBtn}</div>
      </div>
    </div>
  );
};

export default RentalHistorySection;
