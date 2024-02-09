<<<<<<< HEAD
import React, { useState } from "react";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { requestDemo } from "../../../api/mailchimp";
import { useForm } from "react-hook-form";
import { uiGreen, validationMessageStyle } from "../../../constants";
import CallToActionForm from "./CallToAction/CallToActionForm";
import { Stack } from "@mui/material";
const Hero = () => {
  const [heroVideoURL, setHeroVideoURL] = useState("/assets/videos/keyflow-hero-video-hd.mp4");
=======
import React from "react";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { requestDemo } from "../../../api/mailchimp";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../constants";
import CallToActionForm from "./CallToAction/CallToActionForm";
const Hero = () => {
>>>>>>> 18c38cd3d4d747e63362bc02d0d83d401c6de336
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await requestDemo(data);
      console.log(res);
      if (res.status === 200) {
        alert(
          "Thank you for your interest in KeyFlow! We will be in touch shortly."
        );
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  };
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
            // zIndex: "-1",
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
<<<<<<< HEAD
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
=======
            >
              Automate your property management workflow with KeyFlow.
            </h1>
            <p
              className="header-text"
              style={{
                color: "rgb(255,255,255)",
                fontFamily: '"Albert Sans", sans-serif',
>>>>>>> 18c38cd3d4d747e63362bc02d0d83d401c6de336
              }}
            >
              {" "}
              KeyFlow streamlines property management effortlessly. Our
              intuitive software automates every aspect of your workflow, from
              tenant communication to maintenance requests, ensuring seamless
              operations. Simplify rent collection, track expenses, and optimize
              your property's performance with our user-friendly tools.
<<<<<<< HEAD
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
=======
              Experience efficient management, enhanced productivity, and peace
              of mind with KeyFlow – the optimal solution for property managers
              <br />
            </p>
            <CallToActionForm flexInput={true} />
          </div>
          <div className="col-md-6 align-self-center">
            <div className="x_001_laptop_inner_wrap">
              <img
                className="header-laptop-img"
                src="assets/img/x_001_laptop_img.png"
                alt="x_001_laptop_img"
              />
              <div
                id="x_001_laptop"
                className="carousel slide x_001_laptop_indicators x_001_laptop_control_button thumb_scroll_x swipe_x ps_easeOutQuad"
                ride="carousel"
                data-duration={2000}
                data-bs-pause="hover"
                data-bs-interval={8000}
              >
                <ol className="carousel-indicators">
                  <li
                    className="active"
                    data-bs-target="#x_001_laptop"
                    data-bs-slide-to={0}
                  />
                  <li data-bs-target="#x_001_laptop" data-bs-slide-to={1} />
                  <li data-bs-target="#x_001_laptop" data-bs-slide-to={2} />
                </ol>
                <div className="carousel-inner" role="listbox">
                  <div>
                    <img
                      className="header-image"
                      src="assets/img/sample-dashboard.png"
                      alt="x_001_laptop_01"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="assets/img/x_001_laptop_02.jpg"
                      alt="x_001_laptop_02"
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="assets/img/x_001_laptop_03.jpg"
                      alt="x_001_laptop_03"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
>>>>>>> 18c38cd3d4d747e63362bc02d0d83d401c6de336
  );
};

export default Hero;
