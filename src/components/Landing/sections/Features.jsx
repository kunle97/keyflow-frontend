import React, { useEffect, useState } from "react";
import { uiGreen } from "../../../constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Stack } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology"; // AI
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; //Accounting
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"; //E-signature
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin"; //Cryptocurrency
import SmartphoneIcon from "@mui/icons-material/Smartphone"; //Mobile App
import PersonIcon from "@mui/icons-material/Person"; //Useability
import SupportAgentIcon from "@mui/icons-material/SupportAgent"; //Customer Service
import VillaIcon from "@mui/icons-material/Villa"; //Listings
const Features = () => {

  const iconStyles = {
    color: uiGreen,
    fontSize: "20pt",
  };
  const [featureRows, setFeatureRows] = useState([
    {
      title: "AI-powered property management",
      title2: "Artificial Intelligence",
      //Create a description that mentions the AI features: Automated vendor contacting via email, text and phone, Automated tenant communication, Automated accounting tasks, Tenant screening suggestions, Automated background checks, Finding the right properties to build your portfolio, lease creation, and more.
      description:
        "From automated vendor contacting and tenant communication to accounting tasks and tenant screening suggestions, KeyFlow's AI capabilities optimize property performance, enabling owners to focus on growing their real estate portfolio with confidence.",
      long_description:
        "Leverage artificial intelligence to streamline property management. Our platform automates repetitive tasks, enhances communication, and simplifies complex processes, allowing owners to manage their properties with ease. From automated vendor contacting and tenant communication to accounting tasks and tenant screening suggestions, KeyFlow's AI capabilities optimize property performance, enabling owners to focus on growing their real estate portfolio with confidence.",
      align: "right",
      icon: <PsychologyIcon sx={{ ...iconStyles }} />,
    },
    {
      title: "Manage accounting tasks like a pro",
      title2: "Accounting",
      description:
        "Seamlessly manage financial tasks across multiple properties and units effortlessly. Track income and expenses, generating comprehensive reports, reconcile accounts, monitor cash flow, and stay tax-ready with intuitive tools designed for rentals.",
      align: "left",
      image: "/assets/img/landing-page/features/accounting-feature.jpg",
      icon: <AccountBalanceIcon sx={{ ...iconStyles }} />,
    },
    {
      title: "Streamlined e-signing for owners",
      title2: "E-Signature",
      description:
        "Simplify your leasing process with KeyFlow's E-Sign Lease feature. Upload and customize lease agreements effortlessly, enabling prospective tenants to sign electronically from anywhere. Configure terms, clauses, and addenda to suit your needs.",
      align: "right",
      image: "/assets/img/landing-page/features/e-sign-feature.jpg",
      icon: <DriveFileRenameOutlineIcon sx={{ ...iconStyles }} />,
    },
    {
      title: "Accept Cryptocurrency Rent Payments",
      title2: "Cryptocurrency",
      description:
        "KeyFlow's cryptocurrency payment solution enables tenants to pay rent with Bitcoin, Ethereum, and USDC, while property managers receive payments in their preferred currency weather it be all crypto or all cash. Payments can even be recieved in half crypto half cash.",
      align: "left",
      image: "/assets/img/landing-page/features/cryptocurrency-feature.jpg",
      icon: <CurrencyBitcoinIcon sx={{ ...iconStyles }} />,
    },
    {
      title: "Mobile App ",
      title2: "Mobile App",
      description:
        "Our iOS and Android mobile app keeps your properties at your fingertips. Access your properties, tenants, and tasks from anywhere, at any time. Our user-friendly app empowers owners to manage their properties on the go, ensuring seamless operations and tenant communication. ",
      align: "left",
      image: "/assets/img/landing-page/features/mobile-app-feature.jpg",
      icon: <SmartphoneIcon sx={{ ...iconStyles }} />,
    },
    {
      title: "Beginner Friendly",
      title2: "Useability",
      description:
        "KeyFlow's intuitive platform is designed for real estate professionals of all levels. Our user-friendly tools simplify property management, ensuring that owners can effortlessly navigate every aspect of their workflow.",
      align: "right",
      image: "/assets/img/landing-page/features/useability-feature.jpg",
      icon: <PersonIcon sx={{ ...iconStyles }} />,
    },
    {
      title: "24/7 Support",
      title2: "Customer Service",
      description:
        "KeyFlow's dedicated support team is available around the clock to provide assistance and answer your questions. Our knowledgeable professionals are committed to ensuring that you have the support you need to succeed.",
      align: "left",
      image: "/assets/img/landing-page/features/customer-service-feature.jpg",
      icon: <SupportAgentIcon sx={{ ...iconStyles }} />,
    },
    {
      title: "List your properties",
      title2: "Listings",
      description:
        "KeyFlow's marketing tools helps you market your properties, ensuring that your listings reach the right audience. Our platform simplifies the process of creating and distributing listings, enabling owners to effortlessly market their properties on Zillow, Trulia, Realtor and much more.",
      align: "right",
      image: "/assets/img/landing-page/features/marketing-feature.jpg",
      icon: <VillaIcon sx={{ ...iconStyles }} />,
    },
  ]);

  //Create a function that sets the align property of each feature row to left
  const setAlignLeft = () => {
    let newFeatureRows = [...featureRows];
    newFeatureRows.forEach((featureRow) => {
      featureRow.align = "left";
    });
    setFeatureRows(newFeatureRows); //Set the feature rows to the new feature rows
  };

  const handleScreenWidth = () => {
    if (window.innerWidth < 768) {
      setAlignLeft();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleScreenWidth);
    return () => {
      window.removeEventListener("resize", handleScreenWidth);
    };
  }, []);

  return (
    <section id="features" className="landing-section">
      <div className="container">
        <div className="section-header" style={{ margin: "30px auto" }}>
          <h2>Let us do the heavy lifting</h2>
          <p>
            Effortlessly manage tenants, automate tasks, streamline finances,
            and optimize property performance with KeyFlow's comprehensive suite
            of powerful features.
          </p>
        </div>
        <div className="row">
          {featureRows.map((featureRow, index) => (
            <div
              key={index}
              className=" col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 mb-5"
            >
              <div
                className="card"
                style={{
                  borderBottom: "6px solid " + uiGreen,
                  // padding: "20px",
                  // borderRadius: "10px",
                  padding: "10px 10px 20px",
                  height: "100%",
                }}
              >
                <div className="card-body">
                  <Stack direction={"column"} spacing={2}>
                    <span
                      style={{
                        background: "#ecf9ef",
                        padding: "10px",
                        width: "fit-content",
                        borderRadius: "10px",
                      }}
                    >
                      {featureRow.icon}
                    </span>
                    <h5>{featureRow.title}</h5>
                    <p className="text-black">{featureRow.description}</p>
                  </Stack>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
