import React from "react";
import { uiGrey2, validationMessageStyle } from "../../../../../../constants";
import UIButton from "../../../../UIComponents/UIButton";
import { Tooltip, Typography } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import StepControl from "./StepControl";
import { faker } from "@faker-js/faker";

const AddTerms = (props) => {
  return (
    <div>
      {" "}
      <div className="row step-0">
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: uiGrey2, fontSize: "12pt" }}
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
            step="1"
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
          <label className="mb-2 text-black">Rent Frequency</label>
          <select
            {...props.register("rent_frequency", {
              required: "This field is required",
            })}
            className="form-select"
            name="rent_frequency"
          >
            <option value="">Select One</option>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Annually</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.rent_frequency && props.errors.rent_frequency.message}
          </span>
        </div>
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: uiGrey2, fontSize: "12pt" }}
            htmlFor="rent"
          >
            Term Duration
          </Typography>

          <input
            type="number"
            {...props.register("term", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            step={1}
            className="form-control"
            id="term"
            placeholder="Days/Weeks/Months/Years"
            name="term"
          />
          <span style={validationMessageStyle}>
            {props.errors.term && props.errors.term.message}
          </span>
        </div>

        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: uiGrey2, fontSize: "12pt" }}
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
            step="1"
            type="number"
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
            sx={{ color: uiGrey2, fontSize: "12pt" }}
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
            type="number"
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
          <label className="mb-2 text-black">Gas Included</label>
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
          <label className="mb-2 text-black">Water Included</label>
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
          <label className="mb-2 text-black">Electric Included</label>
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
          <label className="mb-2 text-black">Repairs Included</label>
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
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: uiGrey2, fontSize: "12pt" }}
            htmlFor="rent"
          >
            Grace Period
            <Tooltip title="The grace period is the amount of time you give a tenant until they must pay for thier first rent payment.">
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
            sx={{ width: "100%", color: uiGrey2 }}
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
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: uiGrey2, fontSize: "12pt" }}
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
            sx={{ width: "100%", color: uiGrey2 }}
          >
            <option value="">Select One</option>
            <option value={0} selected>
              None
            </option>
            <option value={1}>1 Months</option>
            <option value={2}>2 Months</option>
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
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: uiGrey2, fontSize: "12pt" }}
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
            step="1"
            type="number"
            className="form-control"
            id="leaseCancellationFee"
            placeholder="$"
          />
          <span style={validationMessageStyle}>
            {props.errors.lease_cancellation_fee &&
              props.errors.lease_cancellation_fee.message}
          </span>
        </div>
        {/* Create a simlar field as the lease cancellation fee and notice period for lease renewal fee and lease renewal notice period */}
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: uiGrey2, fontSize: "12pt" }}
            htmlFor="rent"
          >
            Lease Renewal Notice Period
          </Typography>
          <select
            {...props.register("lease_renewal_notice_period", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            className="form-select"
            sx={{ width: "100%", color: uiGrey2 }}
          >
            <option value="">Select One</option>
            <option value={0} selected>
              None
            </option>
            <option value={1}>1 Months</option>
            <option value={2}>2 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
            <option value={13}>13 Months</option>
            <option value={24}>24 Months</option>
            <option value={36}>36 Months</option>
          </select>
          <span style={validationMessageStyle}>
            {props.errors.lease_renewal_notice_period &&
              props.errors.lease_renewal_notice_period.message}
          </span>
        </div>
        <div className="form-group col-md-6 mb-4">
          <Typography
            className="mb-2"
            sx={{ color: uiGrey2, fontSize: "12pt" }}
            htmlFor="leaseRenewalFee"
          >
            Lease renewal Fee
          </Typography>
          <input
            {...props.register("lease_renewal_fee", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]+$/i,
                message: "Please enter a valid number",
              },
            })}
            step="1"
            type="number"
            className="form-control"
            id="leaseRenewalFee"
            placeholder="$"
          />
          <span style={validationMessageStyle}>
            {props.errors.lease_renewal_fee &&
              props.errors.lease_renewal_fee.message}
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
