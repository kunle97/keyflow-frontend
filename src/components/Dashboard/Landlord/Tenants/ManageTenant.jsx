import React from "react";

const ManageTenant = () => {
  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-4">
          <div className="card mb-3">
            <div className="card-body text-center shadow">
              <div className="property-col-img-container">
                <img
                  className="rounded-circle h-100"
                  src="../assets/img/avatars/avatar1.jpeg"
                />
              </div>
              <div className="mb-3">
                <button className="btn btn-primary btn-sm ui-btn" type="button">
                  Change Photo
                </button>
              </div>
              <h4 className="text-white tenant-info-heading">Jane Doe</h4>
              <p className="text-white tenant-info">jsdoe@gmail.com</p>
              <p className="text-white tenant-info">555-555-5555</p>
              <h4 className="text-white tenant-info-heading">Property</h4>
              <p className="text-white tenant-info">
                123 Bleaker St. Englishtown, NJ 02123
              </p>
              <h4 className="text-white tenant-info-heading">Unit</h4>
              <p className="text-white tenant-info">#2A</p>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="row mb-3 d-none">
            <div className="col">
              <div className="card text-white bg-primary shadow">
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col">
                      <p className="m-0">Peformance</p>
                      <p className="m-0">
                        <strong>65.2%</strong>
                      </p>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-rocket fa-2x" />
                    </div>
                  </div>
                  <p className="text-white-50 small m-0">
                    <i className="fas fa-arrow-up" />
                    &nbsp;5% since last month
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card text-white bg-success shadow">
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col">
                      <p className="m-0">Peformance</p>
                      <p className="m-0">
                        <strong>65.2%</strong>
                      </p>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-rocket fa-2x" />
                    </div>
                  </div>
                  <p className="text-white-50 small m-0">
                    <i className="fas fa-arrow-up" />
                    &nbsp;5% since last month
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="username"
                          >
                            <strong>Payment Status</strong>
                          </label>
                          <p className="text-danger">Over Due</p>
                        </div>
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="first_name"
                          >
                            <strong>Lease Term</strong>
                          </label>
                          <p className="text-white">12 months</p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="email"
                          >
                            <strong>Rent Due Date</strong>
                          </label>
                          <p className="text-white">July 15th, 2023</p>
                        </div>
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="last_name"
                          >
                            <strong>Document</strong>
                          </label>
                          <button
                            className="btn btn-primary ui-btn d-block"
                            type="button"
                          >
                            View Lease
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="heading-container">
                <h4 className="text-white float-start mb-0">
                  Maintainance Requests
                </h4>
              </div>
              <div className="card shadow">
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
                          <select
                            className="d-inline-block form-select form-select-sm"
                            style={{ borderStyle: "none" }}
                          >
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
                            style={{
                              borderStyle: "none",
                              color: "var(--bs-card-cap-bg)",
                            }}
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
                          <th>Date</th>
                          <th>Issue</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar1.jpeg"
                            />
                            Airi Satou
                          </td>
                          <td>Accountant</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar2.jpeg"
                            />
                            Angelica Ramos
                          </td>
                          <td>Chief Executive Officer(CEO)</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar3.jpeg"
                            />
                            Ashton Cox
                          </td>
                          <td>Junior Technical Author</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar4.jpeg"
                            />
                            Bradley Greer
                          </td>
                          <td>Software Engineer</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar5.jpeg"
                            />
                            Brenden Wagner
                          </td>
                          <td>Software Engineer</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar1.jpeg"
                            />
                            Brielle Williamson
                          </td>
                          <td>Integration Specialist</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar2.jpeg"
                            />
                            Bruno Nash
                            <br />
                          </td>
                          <td>Software Engineer</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar3.jpeg"
                            />
                            Caesar Vance
                          </td>
                          <td>Pre-Sales Support</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar4.jpeg"
                            />
                            Cara Stevens
                          </td>
                          <td>Sales Assistant</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img
                              className="rounded-circle me-2"
                              width={30}
                              height={30}
                              src="../assets/img/avatars/avatar5.jpeg"
                            />
                            Cedric Kelly
                          </td>
                          <td>Senior JavaScript Developer</td>
                          <td>
                            <button
                              className="btn btn-primary ui-btn"
                              type="button"
                            >
                              Set Resolved
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td>
                            <strong>Occupant</strong>
                          </td>
                          <td>
                            <strong>Position</strong>
                          </td>
                          <td>
                            <strong>Action</strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="row">
                    <div className="col-md-6 align-self-center">
                      <p
                        className="text-white dataTables_info"
                        id="dataTable_info"
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
                            <a
                              className="page-link"
                              aria-label="Previous"
                              href="#"
                            >
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
      </div>
    </div>
  );
};

export default ManageTenant;
