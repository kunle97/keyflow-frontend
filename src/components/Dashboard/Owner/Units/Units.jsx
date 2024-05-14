import React from "react";

const Units = () => {
  return (
    <div className="container">
      <div className="heading-container overflow-auto mb-3">
        <h4 className="text-white float-start mb-0">Units</h4>
        <a
          className="btn btn-primary float-end ui-btn"
          role="button"
          href="/dashboard/units/create"
        >
          Add New Unit
        </a>
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
                    <button className="btn btn-primary ui-btn" type="button">
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
  );
};

export default Units;
