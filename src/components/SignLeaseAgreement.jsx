import React from "react";
import { uiGreen } from "../constants";
import { Button } from "@mui/material";
const SignLeaseAgreement = () => {
  return (
    <div className="container">
      <div className="row">
        <h4 className="my-3">Sign Lease Agreement</h4>
        <div className="card my-3">
          <div className="card-body">
            <h6 className="card-title">Lease Agreement Overview</h6>
            <div className="row">
              <div className="col-md-4">
                <h6>Lease Term</h6>
                <p>12 Months</p>
              </div>
              <div className="col-md-4">
                <h6>Lease Term</h6>
                <p>12 Months</p>
              </div>
              <div className="col-md-4">
                <h6>Lease Term</h6>
                <p>12 Months</p>
              </div>
              <div className="col-md-4">
                <h6>Lease Term</h6>
                <p>12 Months</p>
              </div>
              <div className="col-md-4">
                <h6>Lease Term</h6>
                <p>12 Months</p>
              </div>
              <div className="col-md-4">
                <h6>Lease Term</h6>
                <p>12 Months</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card my-3" style={{ height: "850px" }}>
          {/* PDF Viewer Goes Here */}
        </div>
        <Button
          variant="contained"
          sx={{ background: uiGreen, textTransform: "none" }}
        >
          Sign Lease Agreement
        </Button>
      </div>
    </div>
  );
};

export default SignLeaseAgreement;
