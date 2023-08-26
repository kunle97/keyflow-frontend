import { Button, Stack } from "@mui/material";
import React from "react";
import { uiGreen } from "../../../../constants";

const ViewRentalApplication = () => {
  return (
    <div>
      <div className="mb-3" style={{ overflow: "auto" }}>
        <h4 style={{ float: "left" }}>[Name] Rental Application</h4>
        <Button
          variant="contained"
          sx={{ background: uiGreen, float: "right" }}
        >
          View Full Report
        </Button>
      </div>
      <div className="mb-4">
        <h5 className="mb-2">Personal Information</h5>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Full Name</h6>
                <p>John Doe</p>
              </div>
              <div className="col-md-6">
                <h6>Email</h6>
                <p>johndoe@email.com</p>
              </div>
              <div className="col-md-6">
                <h6>Date Of Birth</h6>
                <p>02/23/02</p>
              </div>
              <div className="col-md-6">
                <h6>Phone</h6>
                <p>555-555-5555</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="mb-2">Questionaire Answers</h5>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Other Occupants</h6>
                <p>No</p>
              </div>
              <div className="col-md-6">
                <h6>Pets</h6>
                <p>No</p>
              </div>
              <div className="col-md-6">
                <h6>Do you have any vehicles?</h6>
                <p>No</p>
              </div>
              <div className="col-md-6">
                <h6>Ever Convicted?</h6>
                <p>No</p>
              </div>
              <div className="col-md-6">
                <h6>Ever Filed for bankrupcy?</h6>
                <p>No</p>
              </div>
              <div className="col-md-6">
                <h6>Ever evicted?</h6>
                <p>No</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h5 className="mb-2">Employment Information</h5>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Full Name</h6>
                <p>John Doe</p>
              </div>
              <div className="col-md-6">
                <h6>Email</h6>
                <p>johndoe@email.com</p>
              </div>
              <div className="col-md-6">
                <h6>Date Of Birth</h6>
                <p>02/23/02</p>
              </div>
              <div className="col-md-6">
                <h6>Phone</h6>
                <p>555-555-5555</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h5 className="mb-2">Residential History</h5>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Full Name</h6>
                <p>John Doe</p>
              </div>
              <div className="col-md-6">
                <h6>Email</h6>
                <p>johndoe@email.com</p>
              </div>
              <div className="col-md-6">
                <h6>Date Of Birth</h6>
                <p>02/23/02</p>
              </div>
              <div className="col-md-6">
                <h6>Phone</h6>
                <p>555-555-5555</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Stack direction="row" gap={2}>
        <Button variant="contained" sx={{ background: "red" }}>
          Reject
        </Button>
        <Button variant="contained" sx={{ background: uiGreen }}>
          Accept
        </Button>
      </Stack>
    </div>
  );
};

export default ViewRentalApplication;
