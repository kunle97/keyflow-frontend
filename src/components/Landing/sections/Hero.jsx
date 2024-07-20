import React, { useState } from "react";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { uiGreen } from "../../../constants";
import CallToActionForm from "./CallToAction/CallToActionForm";
import { Stack } from "@mui/material";
const Hero = () => {
  const [heroVideoURL, setHeroVideoURL] = useState("/assets/videos/keyflow-hero-video-hd.mp4");

  return (
    <div className="hero-container">
      <section
        className="landing-section landing-hero"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: "0",
          }}
        >
          <source src={heroVideoURL} type="video/mp4" />
        </video>
        <div
          className="content-overlay"
          style={{
            position: "relative",
            zIndex: "1",
            height: "100%",
            background:
              "linear-gradient(rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.41) 99%)",
          }}
        >
          <Stack
            direction={"column"}
            spacing={3}
            alignItems="center"
            justifyContent="center"
            style={{ padding: "rem" }}
            className="hero-content-container"
          >
            <h1
              style={{
                color: "rgb(255,255,255)",
                fontFamily: '"Albert Sans", sans-serif',
              }}
              className="hero-title"
            >
              Automate your property management workflow with{" "}
              <span style={{ color: uiGreen }}>Key</span>
              flow.
            </h1>
            <p
              className="header-text hero-text"
              style={{
                color: "rgb(255,255,255)",
                fontFamily: '"Albert Sans", sans-serif',
                textAlign: "center",
              }}
            >
              {" "}
              KeyFlow streamlines property management effortlessly. Our
              intuitive software automates every aspect of your workflow, from
              tenant communication to maintenance requests, ensuring seamless
              operations. Simplify rent collection, track expenses, and optimize
              your property's performance with our user-friendly tools.
            </p>
            {process.env.REACT_APP_ENVIRONMENT === "production" ? (
              <Stack
                direction={"row"}
                spacing={9}
                alignItems="center"
                justifyContent="center"
              >
                <UIButton
                  href="/dashboard"
                  style={{
                    // padding: "0.5rem 2rem",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}
                  btnText="Get Started"
                />
                <UIButton
                  href="/dashboard"
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                    // padding: "0.5rem 2rem",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    border: "1px solid " + uiGreen,
                    cursor: "pointer",
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}
                  btnText="Watch Demo"
                />
              </Stack>
            ) : (
              <CallToActionForm flexInput={true} />
            )}
          </Stack>
        </div>
      </section>
      <div className="header-image-container">
        <img
          className="header-image"
          src="assets/img/sample-dashboard.png"
          alt="x_001_laptop_01"
        />
      </div>
    </div>
  );
};

export default Hero;
