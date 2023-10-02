import React from "react";
import { validationMessageStyle } from "../../../constants";
import { HelpOutline } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import UIButton from "../../Dashboard/UIComponents/UIButton";
const BasicInfoSection = (props) => {
  return (
    <div id="basic-info-section">
      <h5 className="my-4 ml-5">Basic Information</h5>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="form-group">
                <label className="mb-2">First Name</label>
                <input
                  {...props.register("first_name", {
                    required: "Please enter your first name",
                  })}
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="First Name"
                  name="first_name"
                />
                <span style={validationMessageStyle}>
                  {props.errors.first_name && props.errors.first_name.message}
                </span>
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <div className="form-group">
                <label className="mb-2">Last Name</label>
                <input
                  {...props.register("last_name", {
                    required: "Please enter your last name",
                  })}
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Last Name"
                  name="last_name"
                />
                <span style={validationMessageStyle}>
                  {props.errors.last_name && props.errors.last_name.message}
                </span>
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <div className="form-group">
                <label className="mb-2">Date Of Birth</label>
                <input
                  {...props.register("date_of_birth", {
                    required: "Please enter your date of birth",
                    pattern: {
                      value: /\d{4}-\d{2}-\d{2}/,
                      message: "Please enter a valid date",
                    },
                  })}
                  type="date"
                  className=" form-control"
                  id="dateOfBirth"
                  placeholder="Date of Birth"
                  name="date_of_birth"
                  style={{
                    border: "none",
                    borderBottom: "1px solid white !important",
                    borderRadius: "5px",
                    padding: "10px",
                    width: "100%",
                    background: "transparent",
                    color: "white",
                  }}
                />
                <span style={validationMessageStyle}>
                  {props.errors.date_of_birth &&
                    props.errors.date_of_birth.message}
                </span>
              </div>
            </div>

            <div className="col-md-12 mb-4">
              <div className="form-group">
                <label className="mb-2">E-mail</label>
                <input
                  {...props.register("email", {
                    required: "Please enter your email",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  className="form-control form-control-user"
                  id="email"
                  placeholder="E-mail"
                  name="email"
                />
                <span style={validationMessageStyle}>
                  {props.errors.email && props.errors.email.message}
                </span>
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <div className="form-group">
                <label className="mb-2">Phone Number</label>
                <input
                  {...props.register("phone", {
                    required: "Please enter your phone number",
                    pattern: {
                      value: /\d{3}-\d{3}-\d{4}/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Phone Number"
                  name="phone"
                />
                <span style={validationMessageStyle}>
                  {props.errors.phone && props.errors.phone.message}
                </span>
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <div className="form-group">
                <label className="mb-2">
                  Social Security Number{" "}
                  <Tooltip title="Your social security number will not be stored on KeyFlow servers. It will only be used for credit reporting and background checks.">
                    <HelpOutline
                      sx={{
                        marginLeft: "5px",
                        width: "20px",
                      }}
                    />
                  </Tooltip>
                </label>
                <input
                  {...props.register("ssn", {
                    required: "Please enter your social security number",
                    pattern: {
                      value: /\d{3}-\d{2}-\d{4}/,
                      message: "Please enter a valid social security number",
                    },
                  })}
                  type="text"
                  className="form-control"
                  id="ssn"
                  placeholder="SSN"
                  name="ssn"
                />
                <span style={validationMessageStyle}>
                  {props.errors.ssn && props.errors.ssn.message}
                </span>
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <div className="form-group">
                <label className="mb-2">Desired Move-in Date</label>
                <input
                  {...props.register("desired_move_in_date", {
                    required: "Please enter your desired move-in date",
                    pattern: {
                      value: /\d{4}-\d{2}-\d{2}/,
                      message: "Please enter a valid date",
                    },
                  })}
                  type="date"
                  className=" form-control"
                  id="dateOfBirth"
                  placeholder="Desired Move-in Date"
                  name="desired_move_in_date"
                  required
                  style={{
                    border: "none",
                    borderBottom: "1px solid white !important",
                    borderRadius: "5px",
                    padding: "10px",
                    width: "100%",
                    background: "transparent",
                    color: "white",
                  }}
                />

                <span style={validationMessageStyle}>
                  {props.errors.desired_move_in_date &&
                    props.errors.desired_move_in_date.message}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default BasicInfoSection;
