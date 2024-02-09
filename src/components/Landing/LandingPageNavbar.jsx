import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UIButton from "../Dashboard/UIComponents/UIButton";

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
          ? "bg-white"
          : ""
      }   navbar-expand-md fixed-top navbar-transparency`}
      // add  a box shadow to the bottom of the navbar when the user scrolls
      style={{
        boxShadow:
          scrollPosition > 250 || window.innerWidth <= breakpoint
            ? "0px 2px 4px rgba(0, 0, 0, 0.1)"
            : "none",
      }}
    >
      <div className="container">
        <div style={{ width: "100%" }}>
          <a className="navbar-brand" href="/">
            <img
              className="logo"
              src={
                scrollPosition > 250
                  ? "/assets/img/key-flow-logo-black-transparent.png"
                  : "/assets/img/key-flow-logo-white-transparent.png"
              }
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
            <li className="">
              <Link
                className="nav-link landing-nav-link"
                to="/features"
                style={{ color: scrollPosition > 250 ? "black" : "white" }}
              >
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link landing-nav-link"
                to="/pricing"
                style={{ color: scrollPosition > 250 ? "black" : "white" }}
              >
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link landing-nav-link"
                to="/blog"
                style={{ color: scrollPosition > 250 ? "black" : "white" }}
              >
                Blog
              </Link>
            </li>
            {process.env.REACT_APP_ENVIRONMENT === "production" && (
              <li className="nav-item">
                <Link
                  className="nav-link landing-nav-link"
                  to="/dashboard/tenant/login"
                  style={{ color: scrollPosition > 250 ? "black" : "white" }}
                >
                  Tenants
                </Link>
              </li>
            )}
            {process.env.REACT_APP_ENVIRONMENT === "production" && (
              <li className="nav-item">
                <Link
                  className="nav-link landing-nav-link"
                  to="/dashboard/landlord/login"
                  style={{ color: scrollPosition > 250 ? "black" : "white" }}
                >
                  Landlords
                </Link>{" "}
              </li>
            )}
            <li className="nav-item">
              <Link
                className="nav-link landing-nav-link"
                to="/contact"
                style={{ color: scrollPosition > 250 ? "black" : "white" }}
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link  nav-button"
                href="#call-to-action"
                style={{
                  color: scrollPosition > 250 ? "black" : "white",
                  width: "160px",
                }}
              >
                <UIButton type="button" btnText="Request Demo" style={{width:"145px"}} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LandingPageNavbar;
