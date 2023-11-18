import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { uiGrey1 } from "../../constants";

const LandingPageNavbar = (props) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  //Retrieve screen width
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 768;

  const handleScroll = () => {
    const currentPosition = window.pageYOffset;
    setScrollPosition(currentPosition);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    console.log("scrollPosition: ", scrollPosition);
    console.log("width: ", window.innerWidth);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition, window.innerWidth]); // Empty dependency array ensures this effect runs only once

  return (
    <nav
      id="landing-page-navbar"
      className={`navbar ${
        props.isDarkNav ||
        scrollPosition > 250 ||
        window.innerWidth <= breakpoint
          ? "bg-dark"
          : ""
      }  navbar-expand-md fixed-top`}
      style={{
        position: window.innerWidth <= breakpoint ? "fixed" : "relative",
      }}
    >
      <div className="container">
        <div style={{ width: "100%" }}>
          <a className="navbar-brand" href="/">
            <img
              className="logo"
              src="assets/img/key-flow-logo-white-transparent.png"
            />
          </a>
          <button
            data-bs-toggle="collapse"
            className="navbar-toggler"
            data-bs-target="#navcol-1"
          >
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon" />
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#features"
                style={{ color: "rgb(255,255,255)" }}
              >
                Features
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#pricing"
                style={{ color: "rgb(255,255,255)" }}
              >
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/contact"
                style={{ color: "rgb(255,255,255)" }}
              >
                Contact
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/dashboard/tenant/login"
                style={{ color: "rgb(255,255,255)" }}
              >
                Tenants
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/dashboard/landlord/login"
                style={{ color: "rgb(255,255,255)" }}
              >
                Landlords
              </a>{" "}
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                style={{ color: "rgb(255,255,255)" }}
              >
                <button className="btn btn-primary ui-button" type="button">
                  Request A Demo
                </button>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LandingPageNavbar;
