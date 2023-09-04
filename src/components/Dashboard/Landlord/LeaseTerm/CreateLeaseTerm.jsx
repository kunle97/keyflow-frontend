import React, { useState } from "react";
import { Button, Typography, Alert } from "@mui/material";
import { authUser, uiGreen, uiGrey2 } from "../../../../constants";
import { createLeaseTerm } from "../../../../api/api";
import { faker } from "@faker-js/faker";
import BackButton from "../../BackButton";
import Snackbar from "@mui/material/Snackbar";

const CreateLeaseTerm = () => {
  const [rent, setRent] = useState(faker.finance.account(4));
  const [term, setTerm] = useState(12);
  const [lateFee, setLateFee] = useState(faker.finance.account(3));
  const [securityDeposit, setSecurityDeposit] = useState(
    faker.finance.account(4)
  );
  const [gasIncluded, setGasIncluded] = useState("false");
  const [waterIncluded, setWaterIncluded] = useState("false");
  const [electricityIncluded, setElectricityIncluded] = useState("false");
  const [repairsIncluded, setRepairsIncluded] = useState("false");
  const [leaseCancellationNoticePeriod, setLeaseCancellationNoticePeriod] =
    useState(0);
  const [leaseCancellationFee, setLeaseCancellationFee] = useState(
    faker.finance.account(4)
  );
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState(
    "Unit updated successfully"
  );
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowUpdateSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //Get the values from the form
    const data = {
      rent: rent,
      term: term,
      late_fee: lateFee,
      security_deposit: securityDeposit,
      gas_included: gasIncluded,
      water_included: waterIncluded,
      electric_included: electricityIncluded,
      repairs_included: repairsIncluded,
      lease_cancellation_notice_period: leaseCancellationNoticePeriod,
      lease_cancellation_fee: leaseCancellationFee,
    };
    console.log(data);
    //Call the API to createLeaseTerm() function to create the lease term
    createLeaseTerm(data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setShowUpdateSuccess(true);
        setAlertSeverity("success");
        setResponseMessage("Lease term created");
        //Clear the form
        setRent("");
        setTerm("");
        setLateFee("");
        setSecurityDeposit("");
        setGasIncluded("");
        setWaterIncluded("");
        setElectricityIncluded("");
        setRepairsIncluded("");
        setLeaseCancellationNoticePeriod("");
        setLeaseCancellationFee("");

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
          <form className="row" onSubmit={handleSubmit}>
            <div className="form-group col-md-6 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Rent (Dollar Amount)
              </Typography>
              <input
                type="number"
                className="form-control"
                id="rent"
                placeholder="$"
                name="rent"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
              />
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
                // value={age}
                onChange={(e) => setTerm(e.target.value)}
                className="form-select"
                sx={{ width: "100%", color: "white", background: uiGrey2 }}
                name="term"
              >
                <option>Select One</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
                <option value={13}>13 Months</option>
                <option value={24}>24 Months</option>
                <option value={36}>36 Months</option>
              </select>
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
                type="text"
                className="form-control"
                id="lateFee"
                placeholder="$"
                value={lateFee}
                onChange={(e) => setLateFee(e.target.value)}
                name="late_fee"
              />
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
                type="text"
                className="form-control"
                id="security_deposit"
                name="security_deposit"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="$"
              />
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Gas Included</label>
              <select
                className="form-control"
                onChange={(e) => setGasIncluded(e.target.value)}
                name="gas_included"
              >
                <option selected disabled>
                  Select One
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Water Included</label>
              <select
                className="form-control"
                onChange={(e) => setWaterIncluded(e.target.value)}
                name="water_included"
              >
                <option selected disabled>
                  Select One
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Electric Included</label>
              <select
                className="form-control"
                onChange={(e) => setElectricityIncluded(e.target.value)}
                name="electricity_included"
              >
                <option selected disabled>
                  Select One
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Repairs Included</label>
              <select
                className="form-control"
                onChange={(e) => setRepairsIncluded(e.target.value)}
                name="repairs_included"
              >
                <option selected disabled>
                  Select One
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
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
                // value={age}
                onChange={(e) =>
                  setLeaseCancellationNoticePeriod(e.target.value)
                }
                className="form-select"
                sx={{ width: "100%", color: "white" }}
                name="term"
              >
                <option value="">Select One</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
                <option value={13}>13 Months</option>
                <option value={24}>24 Months</option>
                <option value={36}>36 Months</option>
              </select>
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
                type="text"
                className="form-control"
                id="leaseCancellationFee"
                placeholder="$"
                value={leaseCancellationFee}
                onChange={(e) => setLeaseCancellationFee(e.target.value)}
                name="lease_cancellation_fee"
              />
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
