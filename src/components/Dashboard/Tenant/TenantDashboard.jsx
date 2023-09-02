import React, { useEffect, useState } from "react";
import { uiGreen, uiGrey2 } from "../../../constants";
import { authUser } from "../../../constants";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReportIcon from "@mui/icons-material/Report";
import PaymentCalendar from "./PaymentCalendar";
import { listStripePaymentMethods } from "../../../api/api";
import AlertModal from "../Modals/AlertModal";

const TenantDashboard = () => {
  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  const card = (
    <>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} gutterBottom>
          <ReportIcon sx={{ color: "red" }} /> Rent Due in 3 days
        </Typography>

        <Box
          sx={
            {
              // display: "flex",
              // justifyContent: "flex-start",
              // alignItems: "flex-start",
            }
          }
        >
          {" "}
          <Box sx={{ display: "flex", margin: "10px 0" }}>
            <Typography sx={{ marginRight: "5px" }}>Visa ****4455</Typography>
            <a
              sx={{ color: uiGreen, textTransform: "none", float: "right" }}
              href="#"
            >
              Change
            </a>
          </Box>
          <Button
            sx={{
              color: "white",
              textTransform: "none",
              backgroundColor: uiGreen,
            }}
            btnText="Pay Now"
            to="#"
            variant="contained"
          >
            Pay Now
          </Button>
        </Box>
      </CardContent>
    </>
  );

  const [showAddPaymentMethodAlert, setShowAddPaymentMethodAlert] =
    useState(false);

  useEffect(() => {
    //Get the payment methods for the user and check if they at least have one
    listStripePaymentMethods(`${authUser.id}`).then((res) => {
      if (res.data.length < 1) {
        setShowAddPaymentMethodAlert(true);
      }
    });
  }, []);

  return (
    <div className="container">
      <AlertModal
        open={showAddPaymentMethodAlert}
        onClose={() => {}}
        title="Add Payment Method"
        message="Welcome to the Keyflow Dashbaord! Here you will be able to pay your rent, 
        manage your account, view your payment history, and submit maintenance requests. 
        In order to pay your rent, you must first add a payment method. Click the button 
        below to add a payment method."
        to="/dashboard/tenant/add-payment-method"
        btnText="Add Payment Method"
      />
      <div className="d-sm-flex justify-content-between align-items-center mb-4">
        <h3 className="text-light mb-0">
          Good Afternoon, {`${authUser.first_name}!`}
        </h3>
      </div>
      <div className="row">
        <div className="col-lg-5 col-xl-4">
          <Box sx={{ minWidth: 275 }}>
            <div
              className="card shadow mb-4"
              variant="outlined"
              style={{ background: uiGrey2, color: "white" }}
            >
              {card}
            </div>
          </Box>
          <PaymentCalendar />
        </div>
        <div className="col-lg-7 col-xl-8 mb-4">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <p
                className=" m-0 card-header-text p-2"
                style={{ fontSize: "17pt", fontWeight: "400" }}
              >
                Payment History
              </p>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 text-nowrap">
                  <div
                    id="dataTable_length"
                    className="dataTables_length"
                    aria-controls="dataTable"
                  >
                    <label className="form-label text-white">
                      Show&nbsp;
                      <select className="d-inline-block form-select form-select-sm">
                        <option value={10} selected>
                          10
                        </option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      &nbsp;
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="text-md-end dataTables_filter"
                    id="dataTable_filter"
                  >
                    <label className="form-label">
                      <input
                        type="search"
                        className="form-control form-control-sm"
                        aria-controls="dataTable"
                        placeholder="Search"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="table-responsive table mt-2"
                id="dataTable-1"
                role="grid"
                aria-describedby="dataTable_info"
                style={{ height: "430px", overflowY: "scroll" }}
              >
                <table className="table table-hover my-0" id="dataTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Field 2</th>
                      <th>Field 3</th>
                      <th>Qunantity</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar1.jpeg"
                        />
                        Airi Satou
                      </td>
                      <td>Accountant</td>
                      <td>Tokyo</td>
                      <td>33</td>
                      <td>2008/11/28</td>
                      <td>$162,700</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar2.jpeg"
                        />
                        Angelica Ramos
                      </td>
                      <td>Chief Executive Officer(CEO)</td>
                      <td>London</td>
                      <td>47</td>
                      <td>
                        2009/10/09
                        <br />
                      </td>
                      <td>$1,200,000</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar3.jpeg"
                        />
                        Ashton Cox
                      </td>
                      <td>Junior Technical Author</td>
                      <td>San Francisco</td>
                      <td>66</td>
                      <td>
                        2009/01/12
                        <br />
                      </td>
                      <td>$86,000</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar4.jpeg"
                        />
                        Bradley Greer
                      </td>
                      <td>Software Engineer</td>
                      <td>London</td>
                      <td>41</td>
                      <td>
                        2012/10/13
                        <br />
                      </td>
                      <td>$132,000</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar5.jpeg"
                        />
                        Brenden Wagner
                      </td>
                      <td>Software Engineer</td>
                      <td>San Francisco</td>
                      <td>28</td>
                      <td>
                        2011/06/07
                        <br />
                      </td>
                      <td>$206,850</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar1.jpeg"
                        />
                        Brielle Williamson
                      </td>
                      <td>Integration Specialist</td>
                      <td>New York</td>
                      <td>61</td>
                      <td>
                        2012/12/02
                        <br />
                      </td>
                      <td>$372,000</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar2.jpeg"
                        />
                        Bruno Nash
                        <br />
                      </td>
                      <td>Software Engineer</td>
                      <td>London</td>
                      <td>38</td>
                      <td>
                        2011/05/03
                        <br />
                      </td>
                      <td>$163,500</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar3.jpeg"
                        />
                        Caesar Vance
                      </td>
                      <td>Pre-Sales Support</td>
                      <td>New York</td>
                      <td>21</td>
                      <td>
                        2011/12/12
                        <br />
                      </td>
                      <td>$106,450</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar4.jpeg"
                        />
                        Cara Stevens
                      </td>
                      <td>Sales Assistant</td>
                      <td>New York</td>
                      <td>46</td>
                      <td>
                        2011/12/06
                        <br />
                      </td>
                      <td>$145,600</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar5.jpeg"
                        />
                        Cedric Kelly
                      </td>
                      <td>Senior JavaScript Developer</td>
                      <td>Edinburgh</td>
                      <td>22</td>
                      <td>
                        2012/03/29
                        <br />
                      </td>
                      <td>$433,060</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>
                        <strong>Name</strong>
                      </td>
                      <td>
                        <strong>Position</strong>
                      </td>
                      <td>
                        <strong>Office</strong>
                      </td>
                      <td>
                        <strong>Age</strong>
                      </td>
                      <td>
                        <strong>Start date</strong>
                      </td>
                      <td>
                        <strong>Amount</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="row">
                <div className="col-md-6 align-self-center">
                  <p
                    id="dataTable_info"
                    className="dataTables_info"
                    role="status"
                    aria-live="polite"
                  >
                    Showing 1 to 10 of 27
                  </p>
                </div>
                <div className="col-md-6">
                  <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                    <ul className="pagination">
                      <li className="page-item disabled">
                        <a className="page-link" aria-label="Previous" href="#">
                          <span aria-hidden="true">«</span>
                        </a>
                      </li>
                      <li className="page-item active">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" aria-label="Next" href="#">
                          <span aria-hidden="true">»</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-xl-12 mb-4">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6
                className="m-0 card-header-text p-2"
                style={{ fontSize: "17pt", fontWeight: "400" }}
              >
                Maintenance Requests
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 text-nowrap">
                  <div
                    id="dataTable_length"
                    className="dataTables_length"
                    aria-controls="dataTable"
                  >
                    <label className="form-label text-white">
                      Show&nbsp;
                      <select className="d-inline-block form-select form-select-sm">
                        <option value={10} selected>
                          10
                        </option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      &nbsp;
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="text-md-end dataTables_filter"
                    id="dataTable_filter"
                  >
                    <label className="form-label">
                      <input
                        type="search"
                        className="form-control form-control-sm"
                        aria-controls="dataTable"
                        placeholder="Search"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="table-responsive table mt-2"
                id="dataTable-1"
                role="grid"
                aria-describedby="dataTable_info"
                style={{ height: "250px", overflowY: "scroll" }}
              >
                <table className="table table-hover my-0" id="dataTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Field 2</th>
                      <th>Field 3</th>
                      <th>Qunantity</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody style={{ height: "100px", overflowY: "scroll" }}>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar1.jpeg"
                        />
                        Airi Satou
                      </td>
                      <td>Accountant</td>
                      <td>Tokyo</td>
                      <td>33</td>
                      <td>2008/11/28</td>
                      <td>$162,700</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar2.jpeg"
                        />
                        Angelica Ramos
                      </td>
                      <td>Chief Executive Officer(CEO)</td>
                      <td>London</td>
                      <td>47</td>
                      <td>
                        2009/10/09
                        <br />
                      </td>
                      <td>$1,200,000</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar3.jpeg"
                        />
                        Ashton Cox
                      </td>
                      <td>Junior Technical Author</td>
                      <td>San Francisco</td>
                      <td>66</td>
                      <td>
                        2009/01/12
                        <br />
                      </td>
                      <td>$86,000</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar4.jpeg"
                        />
                        Bradley Greer
                      </td>
                      <td>Software Engineer</td>
                      <td>London</td>
                      <td>41</td>
                      <td>
                        2012/10/13
                        <br />
                      </td>
                      <td>$132,000</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar5.jpeg"
                        />
                        Brenden Wagner
                      </td>
                      <td>Software Engineer</td>
                      <td>San Francisco</td>
                      <td>28</td>
                      <td>
                        2011/06/07
                        <br />
                      </td>
                      <td>$206,850</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar1.jpeg"
                        />
                        Brielle Williamson
                      </td>
                      <td>Integration Specialist</td>
                      <td>New York</td>
                      <td>61</td>
                      <td>
                        2012/12/02
                        <br />
                      </td>
                      <td>$372,000</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar2.jpeg"
                        />
                        Bruno Nash
                        <br />
                      </td>
                      <td>Software Engineer</td>
                      <td>London</td>
                      <td>38</td>
                      <td>
                        2011/05/03
                        <br />
                      </td>
                      <td>$163,500</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar3.jpeg"
                        />
                        Caesar Vance
                      </td>
                      <td>Pre-Sales Support</td>
                      <td>New York</td>
                      <td>21</td>
                      <td>
                        2011/12/12
                        <br />
                      </td>
                      <td>$106,450</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar4.jpeg"
                        />
                        Cara Stevens
                      </td>
                      <td>Sales Assistant</td>
                      <td>New York</td>
                      <td>46</td>
                      <td>
                        2011/12/06
                        <br />
                      </td>
                      <td>$145,600</td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          className="rounded-circle me-2"
                          width={30}
                          height={30}
                          src="assets/img/avatars/avatar5.jpeg"
                        />
                        Cedric Kelly
                      </td>
                      <td>Senior JavaScript Developer</td>
                      <td>Edinburgh</td>
                      <td>22</td>
                      <td>
                        2012/03/29
                        <br />
                      </td>
                      <td>$433,060</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>
                        <strong>Name</strong>
                      </td>
                      <td>
                        <strong>Position</strong>
                      </td>
                      <td>
                        <strong>Office</strong>
                      </td>
                      <td>
                        <strong>Age</strong>
                      </td>
                      <td>
                        <strong>Start date</strong>
                      </td>
                      <td>
                        <strong>Amount</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="row">
                <div className="col-md-6 align-self-center">
                  <p
                    id="dataTable_info"
                    className="dataTables_info"
                    role="status"
                    aria-live="polite"
                  >
                    Showing 1 to 10 of 27
                  </p>
                </div>
                <div className="col-md-6">
                  <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                    <ul className="pagination">
                      <li className="page-item disabled">
                        <a className="page-link" aria-label="Previous" href="#">
                          <span aria-hidden="true">«</span>
                        </a>
                      </li>
                      <li className="page-item active">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" aria-label="Next" href="#">
                          <span aria-hidden="true">»</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
