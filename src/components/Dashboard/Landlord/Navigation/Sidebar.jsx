import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  authUser,
  landlordMenuItems,
  tenantMenuItems,
  uiGreen,
  uiGrey2,
} from "../../../../constants";
const Sidebar = (props) => {
  const menuItems =
    authUser.account_type === "owner" ? landlordMenuItems : tenantMenuItems;

  const toggleNavMenu = () => {
    props.setShowNavMenu(!props.showNavMenu);
  };

  const hideNavMenu = () => {
    if (props.showNavMenu) {
      props.setShowNavMenu(false);
    }
  };

  return (
    <div>
      {props.showNavMenu && <div className="overlay" onClick={toggleNavMenu} />}
      {/* <div
        className={`navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark `}
        style={{ background: uiGrey}}
      ></div> */}
      <nav
        className={`navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark ${
          props.showNavMenu ? "" : "dashboard-navbar-hidden"
        }`}
        style={{
          background: "white",
          maxWidth: "450px",
          height: "100vh",
          position: "fixed",
          top: "0",
          zIndex: "100000000",
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
          <ul className="navbar-nav text-light mt-4" id="accordionSidebar">
            {menuItems.map((item, index) => {
              if (item.subMenuItems) {
                return (
                  <li class=" dropdown show dashboard-nav-item">
                    <a
                      class="dropdown-toggle nav-link"
                      aria-expanded="true"
                      data-bs-toggle="dropdown"
                      href="#"
                      style={{ color: uiGrey2, fontSize: "13pt" }}
                    >
                      <i
                        className={"${item.icon} text-gray-400"}
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
                        zIndex: "100000000",
                        position: "absolute",
                      }}
                    >
                      {item.subMenuItems.map((subItem, index) => {
                        return (
                          <Link
                            class="dropdown-item"
                            to={subItem.link}
                            style={{ color: uiGrey2 }}
                          >
                            <li
                              onClick={hideNavMenu} // Hides menu when clicked
                            >
                              <i
                                className={`${subItem.icon} text-gray-400`}
                                style={{ color: uiGrey2, fontSize: "13pt" }}
                              />{" "}
                              <span>{subItem.label}</span>
                            </li>
                          </Link>
                        );
                      })}
                    </div>
                  </li>
                );
              } else {
                return (
                  <li
                    className=" dashboard-nav-item"
                    key={index}
                    onClick={hideNavMenu} // Hides menu when clicked
                  >
                    <Link
                      className="nav-link"
                      to={item.link}
                      style={{ color: uiGrey2, fontSize: "13pt" }}
                    >
                      <i
                        className={`${item.icon} text-gray-400`}
                        style={{
                          color: uiGrey2,
                          fontSize: "17pt",
                          marginRight: "15px",
                        }}
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
    </div>
  );
};

export default Sidebar;
