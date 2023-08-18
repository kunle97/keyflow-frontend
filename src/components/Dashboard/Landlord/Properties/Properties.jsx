import React from "react";

const Properties = () => {
  return (
    <div className="container">
      <div className="col overflow-auto mb-4">
        <h3 className="text-light float-start" style={{ maxWidth: "200px" }}>
          Properties
        </h3>
        <button className="btn btn-primary float-end ui-btn" type="button">
          New Property
        </button>
      </div>
      <div className="card shadow">
        <div className="card-header py-3">
          <p className="text-White m-0 fw-bold">Property Info</p>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 text-nowrap">
              <div
                id="dataTable_length"
                className="dataTables_length"
                aria-controls="dataTable"
              >
                <label className="form-label">
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
            id="dataTable"
            role="grid"
            aria-describedby="dataTable_info"
          >
            <table className="table my-0" id="dataTable">
              <thead>
                <tr>
                  <th className="text-light">Name</th>
                  <th className="text-light">Position</th>
                  <th className="text-light">Office</th>
                  <th className="text-light">Age</th>
                  <th className="text-light">Start date</th>
                  <th className="text-light">Salary</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-light">
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
                  <td>2008/11/28</td>
                  <td>$162,700</td>
                </tr>
                <tr className="text-light">
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
                    2009/10/09
                    <br />
                  </td>
                  <td>$1,200,000</td>
                </tr>
                <tr className="text-light">
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
                    2009/01/12
                    <br />
                  </td>
                  <td>$86,000</td>
                </tr>
                <tr className="text-light">
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
                    2012/10/13
                    <br />
                  </td>
                  <td>$132,000</td>
                </tr>
                <tr className="text-light">
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
                    2011/06/07
                    <br />
                  </td>
                  <td>$206,850</td>
                </tr>
                <tr className="text-light">
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
                    2012/12/02
                    <br />
                  </td>
                  <td>$372,000</td>
                </tr>
                <tr className="text-light">
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
                    2011/05/03
                    <br />
                  </td>
                  <td>$163,500</td>
                </tr>
                <tr className="text-light">
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
                    2011/12/12
                    <br />
                  </td>
                  <td>$106,450</td>
                </tr>
                <tr className="text-light">
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
                    2011/12/06
                    <br />
                  </td>
                  <td>$145,600</td>
                </tr>
                <tr className="text-light">
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
                    2012/03/29
                    <br />
                  </td>
                  <td>$433,060</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="text-light">
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
                    <strong>Salary</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="row">
            <div className="col-md-6 align-self-center">
              <p
                className="text-light dataTables_info"
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

export default Properties;
