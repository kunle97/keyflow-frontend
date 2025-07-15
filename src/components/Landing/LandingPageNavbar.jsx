import React, { useEffect, useState } from "react";
import UIButton from "../Dashboard/UIComponents/UIButton";
import useScreen from "../../hooks/useScreen";
const LandingPageNavbar = (props) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { isMobile } = useScreen();
  const handleScroll = () => {
    const currentPosition = window.pageYOffset;
    setScrollPosition(currentPosition);
  };

  const mobileLinkStyle = {
    color: "black",
    height: "auto",
    padding: "10px 0",
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
        props.isDarkNav || scrollPosition > 250 || isMobile ? "bg-white" : ""
      }   navbar-expand-md fixed-top navbar-transparency`}
      // add  a box shadow to the bottom of the navbar when the user scrolls
      style={{
        boxShadow:
          scrollPosition > 250 || isMobile
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
                props.isDarkNav ||    scrollPosition > 250 || isMobile
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
            <li className="nav-item">
              {isMobile ? (
                <a
                  className="nav-link landing-nav-link"
                  href="#"
                  style={mobileLinkStyle}
                >
                  Home
                </a>
              ) : (
                <a
                  className="nav-link landing-nav-link"
                  href="#"
                  style={{
                    color:  props.isDarkNav || scrollPosition > 250 ? "black" : "white",
                  }}
                >
                  Home
                </a>
              )}
            </li>
            <li className="nav-item">
              {isMobile ? (
                <a
                  className="nav-link landing-nav-link"
                  href="#base-features"
                  style={mobileLinkStyle}
                >
                  Features
                </a>
              ) : (
                <a
                  className="nav-link landing-nav-link"
                  href="#base-features"
                  style={{
                    color:  props.isDarkNav || scrollPosition > 250 ? "black" : "white",
                  }}
                >
                  Features
                </a>
              )}
            </li>
            <li className="nav-item">
              {isMobile ? (
                <a
                  className="nav-link landing-nav-link"
                  href="#rentals"
                  style={mobileLinkStyle}
                >
                  Rentals
                </a>
              ) : (
                <a
                  className="nav-link landing-nav-link"
                  href="#rentals"
                  style={{
                    color:  props.isDarkNav || scrollPosition > 250 ? "black" : "white",
                  }}
                >
                  Rentals
                </a>
              )}
            </li>
            <li className="nav-item">
              {isMobile ? (
                <a
                  className="nav-link landing-nav-link"
                  href="#pricing"
                  style={mobileLinkStyle}
                >
                  Pricing
                </a>
              ) : (
                <a
                  className="nav-link landing-nav-link"
                  href="#pricing"
                  style={{
                    color:  props.isDarkNav || scrollPosition > 250 ? "black" : "white",
                  }}
                >
                  Pricing
                </a>
              )}
            </li>
            <li className="nav-item">
              {isMobile ? (
                <a
                  className="nav-link landing-nav-link"
                  href="/dashboard/tenant/login"
                  style={mobileLinkStyle}
                >
                  Tenants
                </a>
              ) : (
                <a
                  className="nav-link landing-nav-link"
                  href="/dashboard/tenant/login"
                  style={{
                    color:  props.isDarkNav || scrollPosition > 250 ? "black" : "white",
                  }}
                >
                  Tenants
                </a>
              )}
            </li>
            <li className="nav-item">
              {isMobile ? (
                <a
                  className="nav-link landing-nav-link"
                  href="/dashboard/owner/login"
                  style={mobileLinkStyle}
                >
                  Owner
                </a>
              ) : (
                <a
                  className="nav-link landing-nav-link"
                  href="/dashboard/owner/login"
                  style={{
                    color: props.isDarkNav ||  scrollPosition > 250 ? "black" : "white",
                  }}
                >
                  Owner
                </a>
              )}
            </li>
            <li className="nav-item">
              <a
                className="nav-link  nav-button"
                href="#call-to-action"
                style={{
                  color: scrollPosition > 250 ? "black" : "white",
                  width: isMobile ? "100%" : "160px",
                }}
              >
                <UIButton
                  type="button"
                  btnText="Request Demo"
                  style={{ width: "145px" }}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LandingPageNavbar;
