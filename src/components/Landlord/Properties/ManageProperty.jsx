import React from "react";

const ManageProperty = () => {
  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-lg-12">
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
            <div className="col">
              <div className="card shadow mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="text-primary fw-bold m-0 card-header-text">
                    Address
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
                  <form>
                    <div className="mb-3">
                      <label
                        className="form-label text-white"
                        htmlFor="address"
                      >
                        <strong>Address</strong>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="address"
                        placeholder="Sunset Blvd, 38"
                        name="address"
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                    <div className="row">
                      <div className="col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="city"
                          >
                            <strong>City</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="city"
                            placeholder="Los Angeles"
                            name="city"
                            style={{ borderStyle: "none" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="country"
                          >
                            <strong>State</strong>
                          </label>
                          <select className="form-select">
                            <option value>--</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="country"
                          >
                            <strong>Country</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="country-1"
                            placeholder="USA"
                            name="country"
                            style={{ borderStyle: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-end mb-3">
                      <button
                        className="btn btn-primary btn-sm ui-btn"
                        type="submit"
                      >
                        Save&nbsp;Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <div className="card shadow mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="text-primary fw-bold m-0 card-header-text">
                        Proeprty Information
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
                      <form>
                        <div className="row">
                          <div className="col">
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="first_name"
                              >
                                <strong>Beds</strong>
                              </label>
                              <p className="text-white">4</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="last_name"
                              >
                                <strong>Baths</strong>
                              </label>
                              <p className="text-white">2</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="last_name"
                              >
                                <strong>MLS #</strong>
                              </label>
                              <p className="text-white">
                                732EFH82F8BO189FB917B
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="card shadow mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="text-primary fw-bold m-0 card-header-text">
                        Finances
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
                      <form>
                        <div className="row">
                          <div className="col">
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="username"
                              >
                                <strong>Total Revenue</strong>
                              </label>
                              <p className="text-white">$23,049</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="first_name"
                              >
                                <strong>Net Operating Income (NOI)</strong>
                              </label>
                              <p className="text-white">23.4%</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="first_name"
                              >
                                <strong>Property Value</strong>
                              </label>
                              <p className="text-white">$428,324</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="email"
                              >
                                <strong>Total Expenses</strong>
                              </label>
                              <p className="text-white">$13,123</p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 col-sm-12">
                  <div className="card shadow">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="text-primary fw-bold m-0 card-header-text">
                        Units
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
                      <div className="heading-container overflow-auto mb-3">
                        <a
                          className="btn btn-primary float-end ui-btn"
                          role="button"
                          href="/dashboard/units/create"
                        >
                          Add New Unit
                        </a>
                      </div>
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
                                  color: "rgb(255,255,255)",
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
                        <table
                          className="table table-hover my-0"
                          id="dataTable"
                        >
                          <thead>
                            <tr>
                              <th>Occupant</th>
                              <th>Rent Payment</th>
                              <th>Lease End</th>
                              <th>Unit #</th>
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
                              <td>Tokyo</td>
                              <td>33</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>London</td>
                              <td>47</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>San Francisco</td>
                              <td>66</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>London</td>
                              <td>41</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>San Francisco</td>
                              <td>28</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>New York</td>
                              <td>61</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>London</td>
                              <td>38</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>New York</td>
                              <td>21</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>New York</td>
                              <td>46</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                              <td>Edinburgh</td>
                              <td>22</td>
                              <td>
                                <button
                                  className="btn btn-primary ui-btn"
                                  type="button"
                                >
                                  Delete
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
                                <strong>Office</strong>
                              </td>
                              <td>
                                <strong>Unit #</strong>
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
                                <a
                                  className="page-link"
                                  aria-label="Next"
                                  href="#"
                                >
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
      </div>
    </div>
  );
};

export default ManageProperty;
