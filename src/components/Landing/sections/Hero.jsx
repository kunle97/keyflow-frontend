import React from "react";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { requestDemo } from "../../../api/mailchimp";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../constants";
import CallToActionForm from "./CallToAction/CallToActionForm";
const Hero = () => {
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
    <section
      className="landing-section landing-hero"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.41) 99%), url("assets/img/house6.jpg") center / cover',

        overflow: "hidden",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-6 align-self-center">
            <h1
              style={{
                color: "rgb(255,255,255)",
                fontFamily: '"Albert Sans", sans-serif',
              }}
            >
              Automate your property management workflow with KeyFlow.
            </h1>
            <p
              className="header-text"
              style={{
                color: "rgb(255,255,255)",
                fontFamily: '"Albert Sans", sans-serif',
              }}
            >
              {" "}
              KeyFlow streamlines property management effortlessly. Our
              intuitive software automates every aspect of your workflow, from
              tenant communication to maintenance requests, ensuring seamless
              operations. Simplify rent collection, track expenses, and optimize
              your property's performance with our user-friendly tools.
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
  );
};

export default Hero;
