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
          <div
            className="sidebar-brand-icon rotate-n-15"
            style={{ background: "#2c3a4a" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="1em"
              height="1em"
              fill="currentColor"
            >
              <path d="M282.3 343.7L248.1 376.1C244.5 381.5 238.4 384 232 384H192V424C192 437.3 181.3 448 168 448H128V488C128 501.3 117.3 512 104 512H24C10.75 512 0 501.3 0 488V408C0 401.6 2.529 395.5 7.029 391L168.3 229.7C162.9 212.8 160 194.7 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352C317.3 352 299.2 349.1 282.3 343.7zM376 176C398.1 176 416 158.1 416 136C416 113.9 398.1 96 376 96C353.9 96 336 113.9 336 136C336 158.1 353.9 176 376 176z" />
            </svg>
          </div>
          <div className="sidebar-brand-text mx-3">
            <span>KeyFlow</span>
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
