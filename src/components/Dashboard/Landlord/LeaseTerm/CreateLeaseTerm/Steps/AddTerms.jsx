import React from "react";
import { uiGrey2, validationMessageStyle } from "../../../../../../constants";
import UIButton from "../../../../UIComponents/UIButton";
import { Tooltip, Typography } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import StepControl from "./StepControl";

const AddTerms = (props) => {
  return (
    <div>
      {" "}
      <div className="row step-0">
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: "white", fontSize: "12pt" }}
            htmlFor="rent"
          >
            Rent (Dollar Amount)
          </Typography>
          <input
            {...props.register("rent", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            type="number"
            className="form-control"
            id="rent"
            placeholder="$"
            name="rent"
          />
          <span style={validationMessageStyle}>
            {props.errors.rent && props.errors.rent.message}
          </span>
        </div>
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: "white", fontSize: "12pt" }}
            htmlFor="rent"
          >
            Term Duration
          </Typography>
          <select
            {...props.register("term", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            className="form-select"
            sx={{ width: "100%", color: "white", background: uiGrey2 }}
            name="term"
          >
            <option value="">Select One</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
            <option value={13}>13 Months</option>
            <option value={24}>24 Months</option>
            <option value={36}>36 Months</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.term && props.errors.term.message}
          </span>
        </div>

        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: "white", fontSize: "12pt" }}
            htmlFor="lateFee"
          >
            Late Fee
          </Typography>
          <input
            {...props.register("late_fee", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            type="text"
            className="form-control"
            id="lateFee"
            placeholder="$"
            name="late_fee"
          />
          <span style={validationMessageStyle}>
            {props.errors.late_fee && props.errors.late_fee.message}
          </span>
        </div>
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: "white", fontSize: "12pt" }}
            htmlFor="rent"
          >
            Security Deposit (Dollar Amount)
          </Typography>
          <input
            {...props.register("security_deposit", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            type="text"
            className="form-control"
            id="security_deposit"
            placeholder="$"
          />
          <span style={validationMessageStyle}>
            {props.errors.security_deposit &&
              props.errors.security_deposit.message}
          </span>
        </div>

        <div className="form-group col-md-6 mb-4">
          <label className="mb-2">Gas Included</label>
          <select
            {...props.register("gas_included", {
              required: "This field is required",
            })}
            name="gas_included"
            className="form-control"
          >
            <option value="">Select One</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.gas_included && props.errors.gas_included.message}
          </span>
        </div>

        <div className="form-group col-md-6 mb-4">
          <label className="mb-2">Water Included</label>
          <select
            {...props.register("water_included", {
              required: "This field is required",
            })}
            className="form-control"
          >
            <option value="">Select One</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.water_included && props.errors.water_included.message}
          </span>
        </div>
        <div className="form-group col-md-6 mb-4">
          <label className="mb-2">Electric Included</label>
          <select
            {...props.register("electric_included", {
              required: "This field is required",
            })}
            className="form-control"
          >
            <option value="">Select One</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.electric_included &&
              props.errors.electric_included.message}
          </span>
        </div>
        <div className="form-group col-md-6 mb-4">
          <label className="mb-2">Repairs Included</label>
          <select
            {...props.register("repairs_included", {
              required: "This field is required",
            })}
            className="form-control"
          >
            <option value="">Select One</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.repairs_included &&
              props.errors.repairs_included.message}
          </span>
        </div>
        <div className="form-group col-md-12 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: "white", fontSize: "12pt" }}
            htmlFor="rent"
          >
            Grace Period
            <Tooltip title="The grace period is the amount of time you give a tenant until they mus pay for thier first rent payment.">
              <HelpOutline
                sx={{
                  marginLeft: "5px",
                  width: "20px",
                }}
              />
            </Tooltip>
          </Typography>
          <select
            {...props.register("grace_period", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            className="form-select"
            sx={{ width: "100%", color: "white" }}
          >
            <option value="">Select One</option>
            <option value={0} selected>
              None
            </option>
            <option value={1}>1 Months</option>
            <option value={2}>2 Months</option>
            <option value={3}>3 Months</option>
            <option value={4}>4 Months</option>
            <option value={5}>5 Months</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.lease_cancellation_notice_period &&
              props.errors.lease_cancellation_notice_period.message}
          </span>
        </div>
        <div className="form-group col-md-12 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: "white", fontSize: "12pt" }}
            htmlFor="rent"
          >
            Lease Cancellation Notice Period
          </Typography>
          <select
            {...props.register("lease_cancellation_notice_period", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            className="form-select"
            sx={{ width: "100%", color: "white" }}
          >
            <option value="">Select One</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
            <option value={13}>13 Months</option>
            <option value={24}>24 Months</option>
            <option value={36}>36 Months</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.lease_cancellation_notice_period &&
              props.errors.lease_cancellation_notice_period.message}
          </span>
        </div>
        <div className="form-group col-md-12 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: "white", fontSize: "12pt" }}
            htmlFor="leaseCancellationFee"
          >
            Lease Cancellation Fee
          </Typography>
          <input
            {...props.register("lease_cancellation_fee", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            type="text"
            className="form-control"
            id="leaseCancellationFee"
            placeholder="$"
          />
          <span style={validationMessageStyle}>
            {props.errors.lease_cancellation_fee &&
              props.errors.lease_cancellation_fee.message}
          </span>
        </div>
      </div>
      <StepControl
        step={props.step}
        steps={props.steps}
        handlePreviousStep={props.handlePreviousStep}
        handleNextStep={props.handleNextStep}
      />
    </div>
  );
};

export default AddTerms;
