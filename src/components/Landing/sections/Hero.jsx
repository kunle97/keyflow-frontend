import React from "react";

const Hero = () => {
  return (
    <section
      className="landing-section"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.41) 99%), url("assets/img/house3.jpg") center / cover',
        padding: "225px 0",
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
              Nulla eget mollis libero. Vestibulum lacinia vitae sapien id
              varius. Donec sed dolor quis ligula hendrerit lobortis. Donec
              dictum dui nec rhoncus mattis. Quisque sed molestie lacus. Duis id
              nisi non ligula blandit tempor ac ut tortor. Praesent odio dolor,
              dapibus condimentum elit quis, vehicula scelerisque mi
              <br />
            </p>
            <form
              className="d-flex justify-content-center flex-wrap"
              method="post"
            >
              <div style={{ display: "flex", width: "100%" }}>
                <div className="mb-3" style={{ flex: 2 }}>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="Your Email"
                  />
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-primary ms-2 ui-button"
                    type="submit"
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-6">
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
