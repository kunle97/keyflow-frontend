import React, {useState} from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <nav
      className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark"
      style={{ background: "#364658" }}
    >
      <div className="container-fluid d-flex flex-column p-0">
        <a
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          href="#"
        >
         
          <div className="sidebar-brand-text mx-3">
          <img src='/assets/img/key-flow-logo-white-transparent.png' style={{width:"150px"}} />

          </div>
        </a>
        <hr className="sidebar-divider my-0" />
        <ul className="navbar-nav text-light" id="accordionSidebar">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <i className="fas fa-tachometer-alt" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard/tenants">
              <i className="fa fa-group" />
              <span>Tenants</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard/properties">
              <i className="fa fa-home" />
              <span>Properties</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard/maintenance-requests">
              <i className="fas fa-tools" />
              <span>Maintenance Requests</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <i className="fas fa-user-circle" />
              <span>Lease Agreements</span>
            </Link>
          </li>
          <li className="nav-item dropdown show">
            <Link
              className="dropdown-toggle nav-link"
              aria-expanded="true"
              data-bs-toggle="dropdown"
              to="#"
            >
              Dropdown
            </Link>
            <div className="dropdown-menu " data-bs-popper="none">
              <Link className="dropdown-item" to="#">
                Item 1
              </Link>
              <Link className="dropdown-item" to="#">
                Item 2
              </Link>
              <Link className="dropdown-item" to="#">
                Item 3
              </Link>
            </div>
          </li>
        </ul>
        <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
