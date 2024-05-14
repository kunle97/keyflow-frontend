import { Stack } from "@mui/material";
import React, { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { uiGreen } from "../../../constants";

const BaseFeatures = () => {
  
    const [basicfeatures, setBasicFeatures] = useState([
    {
      title: "Online time payments with tenant auto-pay",
      title2: "Payments",
      description:
        "Simplify rent payments with KeyFlow's seamless online system. Tenants can effortlessly make one-time payments or set up auto-pay for hassle-free, scheduled transactions. Our secure platform ensures convenience and reliability, allowing tenants to manage their payments effortlessly while providing property managers with consistent, timely revenue. Say goodbye to manual transactions and hello to streamlined, automated rent collection with KeyFlow's tenant-friendly payment solutions.",
      align: "left",
      image: "/assets/img/landing-page/features/payments-feature.jpg",
    },
    {
      title:
        "Screen potential tenants when they apply via the built in TransUnion service",
      title2: "Rental Applications",
      description:
        "KeyFlow's comprehensive background checks provide owners with the tools to make informed tenant screening decisions. Our platform offers credit, criminal, and eviction reports, enabling owners to assess prospective tenants with confidence. Say goodbye to guesswork and hello to thorough, reliable background checks with KeyFlow.",
      align: "right",
      image: "/assets/img/landing-page/features/background-checks-feature.jpg",
    },
    {
      title2: "Rental Applications",
      title: "Auto generated renal applications for each unit",
      description:
        "KeyFlow's rental application feature streamlines the tenant screening process, enabling owners to manage applications and screen prospective tenants with ease. Our platform integrates with TransUnion's comprehensive background check service, providing owners with the tools to make informed decisions. Say goodbye to manual applications and hello to streamlined, reliable tenant screening with KeyFlow.",
      align: "left",
      image:
        "/assets/img/landing-page/features/rental-applications-feature.jpg",
    },
    {
      title2: "Tenant Communication",
      title:
        "Communicate with your tenants through the built in messaging system.",
      description:
        "KeyFlow's tenant communication feature streamlines communication between owners and tenants. Our built-in messaging system enables owners to effortlessly manage tenant communication, ensuring that important messages are delivered and received. Say goodbye to missed calls and hello to seamless tenant communication with KeyFlow.",
      align: "right",
      image:
        "/assets/img/landing-page/features/tenant-communication-feature.jpg",
    },
    {
      title:
        "Handle maintenance request workflows automatically from creating work orders to paying vendors directly in app.",
      title2: "Maintenance",
      description:
        "KeyFlow revolutionizes maintenance management for owners. Our automated workflow system efficiently handles maintenance requests from start to finish. Tenants can easily submit requests through our platform, which seamlessly notifies property managers and vendors. Track progress, prioritize tasks, and ensure timely resolution, all within one centralized system. Say goodbye to paperwork and hello to streamlined, efficient maintenance management with KeyFlow's automated workflows.",
      align: "right",
      image: "/assets/img/landing-page/features/maintenance-feature.jpg",
    },
  ]);

  return (
    <div id="base-features"  className="container">
      <div className="row base-feature-row" >
        <div className="col-md-6 align-self-center ">
          <div>
            <h3>All the essential features included in every plan</h3>
            <p className="text-black">
              KeyFlow's powerful suite of features is designed to streamline
              every aspect of property management, ensuring that you have
              everything you need to succeed.
            </p>
          </div>
          <ul
            style={{
              margin: 0,
              padding: 0,
            }}
          >
            {basicfeatures.map((feature, index) => (
              <li key={index}>
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems="center"
                  justifyContent="flex-start"
                  style={{ marginBottom: "1rem" }}
                >
                  <CheckIcon
                    sx={{
                      color: uiGreen,
                      fontSize: "1rem",
                    }}
                  />
                  <p className="feature-heading">{feature.title}</p>
                </Stack>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="col-md-6 align-self-center"
        >
          <div
            style={{
              overflow: "hidden",
            }}
          >
            <img
              src="/assets/img/landing-page/features/basic-features-info-graphic.png"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseFeatures;
