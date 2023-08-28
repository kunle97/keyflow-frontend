import React, {useState} from "react";
import { Link } from "react-router-dom";
import { landlordMenuItems } from "../../../../constants";
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
          {landlordMenuItems.map((item, index) => {
            return (
              <li className="nav-item" key={index}>
                <Link className="nav-link" to={item.link}>
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
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
