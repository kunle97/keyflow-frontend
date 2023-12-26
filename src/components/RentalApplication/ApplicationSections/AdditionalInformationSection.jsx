import React from "react";
import { validationMessageStyle } from "../../../constants";
import { Stack } from "@mui/material";
import UIButton from "../../Dashboard/UIComponents/UIButton";
const AdditionalInformationSection = (props) => {
  return (
    <div id="questionaire-section">
      <h5 className="my-4 ml-5">Additional Information</h5>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="form-group col-md-6 mb-4">
              <label className="mb-2 text-black">Will there be any other occupants?</label>
              <select
                {...props.register("other_occupants", {
                  required: "This is a required field",
                })}
                className="form-select"
                defaultValue="false"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {props.errors.other_occupants &&
                  props.errors.other_occupants.message}
              </span>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2 text-black">
                Do you plan on having any pets during your lease?
              </label>
              <select
                {...props.register("pets", {
                  required: "This is a required field",
                })}
                className="form-select"
                defaultValue="false"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {props.errors.pets && props.errors.pets.message}
              </span>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2 text-black">
                Do you plan on having/storing any vehicles?
              </label>
              <select
                {...props.register("vehicles", {
                  required: "This is a required field",
                })}
                className="form-select"
                defaultValue="false"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {props.errors.vehicles && props.errors.vehicles.message}
              </span>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2 text-black">
                Have you ever been convicted of a crime?
              </label>
              <select
                {...props.register("crime", {
                  required: "This is a required field",
                })}
                className="form-select"
                defaultValue="false"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {props.errors.crime && props.errors.crime.message}
              </span>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2 text-black">Have you ever filed for bankrupcy?</label>
              <select
                {...props.register("bankrupcy", {
                  required: "This is a required field",
                })}
                className="form-select"
                defaultValue="false"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {props.errors.bankrupcy && props.errors.bankrupcy.message}
              </span>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2 text-black">
                Have you been evicted from aprevious residence?
              </label>
              <select
                {...props.register("evicted", {
                  required: "This is a required field",
                })}
                className="form-select"
                defaultValue="false"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {props.errors.evicted && props.errors.evicted.message}
              </span>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default AdditionalInformationSection;
