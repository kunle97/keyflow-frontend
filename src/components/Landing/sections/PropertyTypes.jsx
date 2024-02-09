import React from "react";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import { HolidayVillageOutlined } from "@mui/icons-material";
const PropertyTypes = () => {
  return (
    <section id="rentals"  className="landing-section">
      <div className="container ">
        {" "}
        <div className="section-header">
          <h2>Keyflow is here to help manage any property</h2>
          <p>
            Enhanced features to simplfy and navigate a complex&nbsp;
            industry&nbsp;
          </p>
        </div>
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col">
            <img
              className="rounded w-100 h-100 fit-cover"
              style={{ minHeight: 300 }}
              src="assets/img/house5.jpg"
            />
          </div>
          <div className="col d-flex flex-column justify-content-center align-self-center p-4">
            <div className="row">
              <div className="text-center text-md-start d-flex flex-column align-items-center align-items-md-start mb-5 col-md-6">
                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon md">
                  <HouseOutlinedIcon />
                </div>
                <div>
                  <h4 className="property-type-heading">Single Family</h4>
                  <p className="property-type-text">
                    Efficiently manage individual residences with tailored tools
                    for streamlined operations and tenant engagement.
                  </p>
                </div>
              </div>
              <div className="text-center text-md-start d-flex flex-column align-items-center align-items-md-start mb-5 col-md-6">
                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon md">
                  <HolidayVillageOutlined />
                </div>
                <div>
                  <h4 className="property-type-heading">Multi Family</h4>
                  <p className="property-type-text">
                    Simplify management across multiple units, optimizing
                    workflows for seamless tenant communication and efficient
                    operations.
                  </p>
                </div>
              </div>
              <div className="text-center text-md-start d-flex flex-column align-items-center align-items-md-start col-md-6">
                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="bi bi-building"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
                    />
                    <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="property-type-heading">Apartment Buildings</h4>
                  <p className="property-type-text">
                    Streamline operations for larger-scale properties,
                    facilitating tenant management, maintenance, and financial
                    tasks effortlessly.
                  </p>
                </div>
              </div>
              <div className="text-center text-md-start d-flex flex-column align-items-center align-items-md-start col-md-6">
                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon md">
                  <WarehouseOutlinedIcon />
                </div>
                <div>
                  <h4 className="property-type-heading">Short Term Rentals</h4>
                  <p className="property-type-text">
                    Effortlessly handle turnovers, bookings, and guest
                    communication, ensuring smooth operations for vacation and
                    short-term rentals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
