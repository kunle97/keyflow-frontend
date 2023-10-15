import React, { useState } from "react";
import { Button, Typography, Alert, Tooltip } from "@mui/material";
import { authUser, uiGreen, uiGrey2 } from "../../../../constants";
import { createLeaseTerm } from "../../../../api/lease_terms";
import { faker } from "@faker-js/faker";
import BackButton from "../../UIComponents/BackButton";
import Snackbar from "@mui/material/Snackbar";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import { useNavigate } from "react-router";
import { HelpOutline } from "@mui/icons-material";
const CreateLeaseTerm = () => {
  const [rent, setRent] = useState(process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.account(4));
  const [term, setTerm] = useState(12);
  const [lateFee, setLateFee] = useState(process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.account(3));
  const [securityDeposit, setSecurityDeposit] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.account(4)
  );
  const [gasIncluded, setGasIncluded] = useState("false");
  const [waterIncluded, setWaterIncluded] = useState("false");
  const [electricityIncluded, setElectricityIncluded] = useState("false");
  const [repairsIncluded, setRepairsIncluded] = useState("false");
  const [leaseCancellationNoticePeriod, setLeaseCancellationNoticePeriod] =
    useState(0);
  const [leaseCancellationFee, setLeaseCancellationFee] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.account(4)
  );
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState(
    "Unit updated successfully"
  );
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rent: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.account(4),
      term: 12,
      late_fee: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.account(3),
      security_deposit: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.account(4),
      gas_included: "false",
      water_included: "false",
      electric_included: "false",
      repairs_included: "false",
      grace_period: 0,
      lease_cancellation_notice_period: 12,
      lease_cancellation_fee: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.account(4),
    },
  });

  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowUpdateSuccess(false);
  };

  const onSubmit = (data) => {
    //Get the values from the form
    console.log(data);
    //Call the API to createLeaseTerm() function to create the lease term
    createLeaseTerm(data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setShowUpdateSuccess(true);
        setAlertSeverity("success");
        setResponseMessage("Lease term created");
        //navigate to previous page
        navigate(-1);
      } else {
        setShowUpdateSuccess(true);
        setAlertSeverity("error");
        setResponseMessage("Something went wrong");
      }
    });
  };
  return (
    <div className="container">
      <BackButton />
      <h2 style={{ color: "white" }}>Create Lease Term</h2>
      <div className="card">
        <div className="card-body" style={{ overflow: "auto" }}>
          <form className="row" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group col-md-6 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Rent (Dollar Amount)
              </Typography>
              <input
                {...register("rent", {
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
                {errors.rent && errors.rent.message}
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
                {...register("term", {
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
                {errors.term && errors.term.message}
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
                {...register("late_fee", {
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
                {errors.late_fee && errors.late_fee.message}
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
                {...register("security_deposit", {
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
                {errors.security_deposit && errors.security_deposit.message}
              </span>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Gas Included</label>
              <select
                {...register("gas_included", {
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
                {errors.gas_included && errors.gas_included.message}
              </span>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Water Included</label>
              <select
                {...register("water_included", {
                  required: "This field is required",
                })}
                className="form-control"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {errors.water_included && errors.water_included.message}
              </span>
            </div>
            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Electric Included</label>
              <select
                {...register("electric_included", {
                  required: "This field is required",
                })}
                className="form-control"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {errors.electric_included && errors.electric_included.message}
              </span>
            </div>
            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Repairs Included</label>
              <select
                {...register("repairs_included", {
                  required: "This field is required",
                })}
                className="form-control"
              >
                <option value="">Select One</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <span style={validationMessageStyle}>
                {errors.repairs_included && errors.repairs_included.message}
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
                {...register("grace_period", {
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
                {errors.lease_cancellation_notice_period &&
                  errors.lease_cancellation_notice_period.message}
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
                {...register("lease_cancellation_notice_period", {
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
                {errors.lease_cancellation_notice_period &&
                  errors.lease_cancellation_notice_period.message}
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
                {...register("lease_cancellation_fee", {
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
                {errors.lease_cancellation_fee &&
                  errors.lease_cancellation_fee.message}
              </span>
            </div>
            <div className="form-group col-md-12">
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  color: "white",
                  background: uiGreen,
                  float: "right",
                }}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
          <Snackbar
            open={showUpdateSuccess}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={alertSeverity}
              sx={{ width: "100%" }}
            >
              <>{responseMessage}</>
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaseTerm;
