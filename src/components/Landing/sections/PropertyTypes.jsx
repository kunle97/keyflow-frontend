import React from "react";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import { HolidayVillageOutlined } from "@mui/icons-material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SchoolIcon from "@mui/icons-material/School";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import StoreIcon from "@mui/icons-material/Store";
const PropertyTypes = () => {
  const iconStyle = {
    fontSize: "1.8rem",
  };
  const PropertyTypes = [
    {
      name: "Single Family",
      description:
        "Efficiently manage individual residences with tailored tools for streamlined operations and tenant engagement.",
      icon: <HouseOutlinedIcon sx={iconStyle} />,
    },
    {
      name: "Multi Family",
      description:
        "Simplify management across multiple units, optimizing workflows for seamless tenant communication and efficient operations.",
      icon: <HolidayVillageOutlined sx={iconStyle} />,
    },
    {
      name: "Apartment Buildings",
      description:
        "Streamline operations for larger-scale properties, facilitating tenant management, maintenance, and financial tasks effortlessly.",
      icon: <ApartmentIcon sx={iconStyle} />,
    },
    {
      name: "Short Term Rentals",
      description:
        "Effortlessly handle turnovers, bookings, and guest communication, ensuring smooth operations for vacation and short-term rentals.",
      icon: <WarehouseOutlinedIcon sx={iconStyle} />,
    },
    {
      name: "Commercial Real Estate",
      description:
        "Manage commercial properties with ease, from tenant communication to lease management and financial tracking.",
      icon: <StoreIcon sx={iconStyle} />,
    },
    {
      name: "Student Housing",
      description:
        "Elevate student housing management effortlessly. Seamlessly oversee accommodations, optimize occupancy, and enhance student experiences.",
      icon: <SchoolIcon sx={iconStyle} />,
    },
    {
      name: "Storage Units",
      description:
        "Effortlessly manage your storage units with our tailord tools to streamline operations, optimize occupancy, and enhance tenant satisfaction",
      icon: <WarehouseOutlinedIcon sx={iconStyle} />,
    },
    {
      name: "Condos/Townhomes",
      description:
        "Empower HOAs and property managers to effortlessly oversee townhomes and condos. Streamline management tasks and effectively track property details.",
      icon: <HomeWorkIcon sx={iconStyle} />,
    },
  ];

  return (
    <section id="rentals" className="landing-section">
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
              {PropertyTypes.map((propertyType, index) => {
                return (
                  <div
                    key={index}
                    className="text-center text-md-start d-flex flex-column align-items-center align-items-md-start mb-3 col-md-6"
                  >
                    <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon md">
                      {propertyType.icon}
                    </div>
                    <div>
                      <h4 className="property-type-heading">
                        {propertyType.name}
                      </h4>
                      <p className="property-type-text">
                        {propertyType.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
