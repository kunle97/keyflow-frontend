import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  authUser,
  landlordMenuItems,
  tenantMenuItems,
  uiGrey2,
} from "../../../../constants";
const Sidebar = () => {
  const menuItems =
    authUser.account_type === "landlord" ? landlordMenuItems : tenantMenuItems;
  const [showSearchMenu, setShowSearchMenu] = useState(false);

  return (
    <nav
      className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark"
      style={{
        background: "white",
        height: "100vh",
        width: "400px !important",
      }}
    >
      <div className="container-fluid d-flex flex-column p-0">
        <a
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          href="#"
        >
          <div className="sidebar-brand-text mx-3">
            <Link to="/dashboard/landlord">
              <img
                src="/assets/img/key-flow-logo-black-transparent.png"
                style={{ width: "200px", marginTop: "60px" }}
              />
            </Link>
          </div>
        </a>
        <hr className="sidebar-divider my-0" />
        <ul className="navbar-nav text-light" id="accordionSidebar">
          {menuItems.map((item, index) => {
            if (item.subMenuItems) {
              return (
                <li class="nav-item dropdown show dashboard-nav-item">
                  <a
                    class="dropdown-toggle nav-link"
                    aria-expanded="true"
                    data-bs-toggle="dropdown"
                    href="#"
                    style={{ color: uiGrey2, fontSize: "13pt" }}
                  >
                    <i
                      className={'${item.icon} text-gray-400'}
                      style={{ color: uiGrey2, fontSize: "13pt" }}
                    />
                    {item.label}
                  </a>
                  <div
                    class="dropdown-menu "
                    data-bs-popper="none"
                    style={{
                      background: "white",
                      borderRadius: "15px",
                      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                      zIndex:"100000000",
                      position:"absolute",
                      
                    }}
                  >
                    {item.subMenuItems.map((subItem, index) => {
                      return (
                        <Link
                          class="dropdown-item"
                          to={subItem.link}
                          style={{ color: uiGrey2 }}
                        >
                          <i
                            className={`${subItem.icon} text-gray-400`}
                            style={{ color: uiGrey2, fontSize: "13pt" }}
                          />{" "}
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </li>
              );
            } else {
              return (
                <li className="nav-item dashboard-nav-item" key={index} >
                  <Link
                    className="nav-link"
                    to={item.link}
                    style={{ color: uiGrey2, fontSize: "13pt" }}
                  >
                    <i
                      className={`${item.icon} text-gray-400`}
                      style={{ color: uiGrey2, fontSize: "17pt", marginRight:"15px" }}
                    />
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
