import React from "react";

const Dashboard = () => {
  return (
    <div className="container">
      <div className="d-sm-flex justify-content-between align-items-center mb-4">
        <h3 className="text-light mb-0">Dashboard</h3>
        <a
          className="btn btn-primary btn-sm d-none d-sm-inline-block border"
          role="button"
          href="#"
          style={{ background: "#3aaf5c" }}
        >
          <i className="fas fa-download fa-sm text-white-50" />
          &nbsp;Generate Report
        </a>
      </div>
      <div className="row">
        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card shadow border-start-primary py-2">
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2">
                  <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                    <span className="card-header-text">Rent Due</span>
                  </div>
                  <div className="text-dark fw-bold h5 mb-0">
                    <span className="card-text">12/21/23</span>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-bar fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card shadow border-start-success py-2">
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2">
                  <div className="text-uppercase text-success fw-bold text-xs mb-1">
                    <span className="card-header-text">Total Expenses</span>
                  </div>
                  <div className="text-dark fw-bold h5 mb-0">
                    <span className="card-text">$215,000</span>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card shadow border-start-info py-2">
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2">
                  <div className="text-uppercase text-info fw-bold text-xs mb-1">
                    <span className="card-header-text">Monthly Income</span>
                  </div>
                  <div className="row g-0 align-items-center">
                    <div className="col-auto">
                      <div className="text-dark fw-bold h5 mb-0 me-3">
                        <span className="card-text">50%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-line fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3 mb-4">
          <div className="card shadow border-start-warning py-2">
            <div className="card-body">
              <div className="row align-items-center no-gutters">
                <div className="col me-2">
                  <div className="text-uppercase text-warning fw-bold text-xs mb-1">
                    <span className="card-header-text">Requests</span>
                  </div>
                  <div className="text-dark fw-bold h5 mb-0">
                    <span className="card-text">18</span>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-7 col-xl-8">
          <div className="card shadow mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Earnings Overview
              </h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div
                className="chart-area"
                style={{ background: "#3aaf5c", color: "rgb(58,175,92)" }}
              >
                <canvas data-bss-chart='{"type":"line","data":{"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],"datasets":[{"label":"Earnings","fill":true,"data":["0","10000","5000","15000","10000","20000","15000","25000"],"backgroundColor":"rgba(78, 115, 223, 0.05)","borderColor":"rgba(78, 115, 223, 1)"}]},"options":{"maintainAspectRatio":false,"legend":{"display":false,"labels":{"fontStyle":"normal"}},"title":{"fontStyle":"normal"},"scales":{"xAxes":[{"gridLines":{"color":"rgb(234, 236, 244)","zeroLineColor":"rgb(234, 236, 244)","drawBorder":true,"drawTicks":false,"borderDash":["2"],"zeroLineBorderDash":["2"],"drawOnChartArea":false},"ticks":{"fontColor":"#ffffff","fontStyle":"normal","padding":20}}],"yAxes":[{"gridLines":{"color":"rgb(234, 236, 244)","zeroLineColor":"rgb(234, 236, 244)","drawBorder":true,"drawTicks":false,"borderDash":["2"],"zeroLineBorderDash":["2"]},"ticks":{"fontColor":"#ffffff","fontStyle":"normal","padding":20}}]}}}' />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7 col-xl-8">
          <div />
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Recent Transactions
              </h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
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
              >
                <table className="table table-hover my-0" id="dataTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Office</th>
                      <th>Age</th>
                      <th>Start date</th>
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
        <div className="col-lg-5 col-xl-4">
          <div className="card">
            <div className="card-header py-3">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Rent Over Due
              </h6>
            </div>
            <div className="card-body">
              <p className="card-text">
                John Doe is 3 Days overdue for their rent payment.
              </p>
              <a className="card-link" href="#" style={{ color: "#3aaf5c" }}>
                Dismiss
              </a>
            </div>
          </div>
          <div className="card shadow mb-4" style={{ marginTop: "15px" }}>
            <div className="card-header py-3">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Account Setup
              </h6>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <h6 className="mb-0">
                      <strong>Verify Email</strong>
                    </h6>
                  </div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-32 0 512 512"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                    >
                      {/*! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. */}
                      <path d="M200.3 142.4C193.3 135.9 183.1 134.2 174.4 138C165.7 141.8 160 150.5 160 159.1v192C160 361.5 165.7 370.2 174.4 374c8.719 3.812 18.91 2.094 25.91-4.375l104-96C309.2 269.1 312 262.7 312 256s-2.812-13.09-7.719-17.62L200.3 142.4zM384 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h320c35.34 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.18 16-16 16H64c-8.82 0-16-7.18-16-16V96c0-8.82 7.18-16 16-16h320c8.82 0 16 7.18 16 16V416z" />
                    </svg>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <h6 className="mb-0">
                      <strong>
                        Connect Your Bank Account To Receive Payments
                      </strong>
                    </h6>
                  </div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-32 0 512 512"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                    >
                      {/*! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. */}
                      <path d="M200.3 142.4C193.3 135.9 183.1 134.2 174.4 138C165.7 141.8 160 150.5 160 159.1v192C160 361.5 165.7 370.2 174.4 374c8.719 3.812 18.91 2.094 25.91-4.375l104-96C309.2 269.1 312 262.7 312 256s-2.812-13.09-7.719-17.62L200.3 142.4zM384 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h320c35.34 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.18 16-16 16H64c-8.82 0-16-7.18-16-16V96c0-8.82 7.18-16 16-16h320c8.82 0 16 7.18 16 16V416z" />
                    </svg>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <h6 className="mb-0">
                      <strong>Enable 2FA</strong>
                    </h6>
                  </div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-32 0 512 512"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                    >
                      {/*! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. */}
                      <path d="M200.3 142.4C193.3 135.9 183.1 134.2 174.4 138C165.7 141.8 160 150.5 160 159.1v192C160 361.5 165.7 370.2 174.4 374c8.719 3.812 18.91 2.094 25.91-4.375l104-96C309.2 269.1 312 262.7 312 256s-2.812-13.09-7.719-17.62L200.3 142.4zM384 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h320c35.34 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.18 16-16 16H64c-8.82 0-16-7.18-16-16V96c0-8.82 7.18-16 16-16h320c8.82 0 16 7.18 16 16V416z" />
                    </svg>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <button
            className="btn btn-primary ui-btn"
            type="button"
            style={{ width: "100%" }}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
