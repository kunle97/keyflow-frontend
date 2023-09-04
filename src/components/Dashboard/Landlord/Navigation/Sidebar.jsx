import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  authUser,
  landlordMenuItems,
  tenantMenuItems,
} from "../../../../constants";
const Sidebar = () => {
  const menuItems =
    authUser.account_type === "landlord" ? landlordMenuItems : tenantMenuItems;

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
            <img
              src="/assets/img/key-flow-logo-white-transparent.png"
              style={{ width: "150px" }}
            />
          </div>
        </a>
        <hr className="sidebar-divider my-0" />
        <ul className="navbar-nav text-light" id="accordionSidebar">
          {menuItems.map((item, index) => {
            if (item.subMenuItems) {
              return (
                <li class="nav-item dropdown show">
                  <a
                    class="dropdown-toggle nav-link"
                    aria-expanded="true"
                    data-bs-toggle="dropdown"
                    href="#"
                  >
                    <i className={item.icon} />
                    {item.label}
                  </a>
                  <div class="dropdown-menu " data-bs-popper="none">
                    {item.subMenuItems.map((subItem, index) => {
                      return (
                        <a class="dropdown-item" href="#">
                          <i className={subItem.icon} />{" "}
                          <span>{subItem.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </li>
              );
            } else {
              return (
                <li className="nav-item" key={index}>
                  <Link className="nav-link" to={item.link}>
                    <i className={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            }
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
