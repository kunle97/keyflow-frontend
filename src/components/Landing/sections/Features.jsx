import React, { useEffect, useState } from "react";
import { Parallax } from "react-scroll-parallax";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import { uiGreen } from "../../../constants";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import { Stack, Typography } from "@mui/material";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { faker } from "@faker-js/faker";
import DrawIcon from "@mui/icons-material/Draw";
import HandymanIcon from '@mui/icons-material/Handyman';
import PostAddIcon from '@mui/icons-material/PostAdd';import ReceiptIcon from '@mui/icons-material/Receipt';
import CachedIcon from '@mui/icons-material/Cached';
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
const Features = () => {
  const featureIconStyle = {
    color: uiGreen,
    fontSize: "3rem",
  };

  const [featureRows, setFeatureRows] = useState([
    {
      title: "One time payments with tenant auto-pay",
      description:
        "Simplify rent payments with KeyFlow's seamless online system. Tenants can effortlessly make one-time payments or set up auto-pay for hassle-free, scheduled transactions. Our secure platform ensures convenience and reliability, allowing tenants to manage their payments effortlessly while providing property managers with consistent, timely revenue. Say goodbye to manual transactions and hello to streamlined, automated rent collection with KeyFlow's tenant-friendly payment solutions.",
      align: "left",
      icon: <PaymentIcon sx={featureIconStyle} />,
      infoGraphic: (
        <div className="card feature-card">
          <div className="card-body">
            <h4 className="card-title" style={{ color: "rgb(255,255,255)" }}>
              <i
                className="fas fa-dollar-sign feature-card-icon"
                style={{ color: "rgb(58, 175, 92)" }}
              />
              &nbsp; Payment Success
            </h4>
            <h4 className="feature-card-text">+$3,400</h4>
            <p className="feature-card-text">
              John Smith made a rent payment today.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Handle maintenance request workflows automatically.",
      description:
        "KeyFlow revolutionizes maintenance management for landlords. Our automated workflow system efficiently handles maintenance requests from start to finish. Tenants can easily submit requests through our platform, which seamlessly notifies property managers and vendors. Track progress, prioritize tasks, and ensure timely resolution, all within one centralized system. Say goodbye to paperwork and hello to streamlined, efficient maintenance management with KeyFlow's automated workflows.",
      align: "right",
      icon: <HomeRepairServiceIcon sx={featureIconStyle} />,
      infoGraphic: (
        <Timeline align="left">
          <TimelineItem>
            <TimelineOppositeContent sx={{ flex: 0.1 }}>
              <Typography variant="body2" color="text.secondary">
                9:30 am
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot sx={{ background: uiGreen }}>
                <PostAddIcon  />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography sx={{ color: "black" }} variant="h6" component="span">
                Maintenance Request Created
              </Typography>
              <Typography sx={{ color: "black" }}>
                Your tenant has submitted a maintenance request
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent sx={{ flex: 0.1 }}>
              <Typography variant="body2" color="text.secondary">
                9:30 am
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot sx={{ background: uiGreen }}>
                <ReceiptIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography sx={{ color: "black" }} variant="h6" component="span">
                Work Order Created
              </Typography>
              <Typography sx={{ color: "black" }}>
                A work order has been created for your maintenance request
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent sx={{ flex: 0.1 }}>
              <Typography variant="body2" color="text.secondary">
                9:30 am
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot sx={{ background: uiGreen }} variant="outlined">
                <HandymanIcon />
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography sx={{ color: "black" }} variant="h6" component="span">
                Vendor Assigned
              </Typography>
              <Typography sx={{ color: "black" }}>
                A vendor has been assigned to your work order
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent sx={{ flex: 0.1 }}>
              <Typography variant="body2" color="text.secondary">
                9:30 am
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
              <TimelineDot sx={{ background: uiGreen }}>
                <CachedIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography sx={{ color: "black" }} variant="h6" component="span">
                Work Order In Progress
              </Typography>
              <Typography sx={{ color: "black" }}>
                The vendor is working on your work order
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      ),
    },
    {
      title: "Manage accounting tasks like a pro",
      description:
        "KeyFlow empowers real estate professionals to become accounting virtuosos. Seamlessly manage financial tasks across multiple properties and units effortlessly. From tracking income and expenses to generating comprehensive reports, our platform simplifies complex accounting processes. Easily reconcile accounts, monitor cash flow, and stay tax-ready with intuitive tools designed for real estate management. Whether it's managing rental income or tracking property-related expenses, KeyFlow equips you with the expertise and efficiency to handle accounting tasks like a seasoned professional, allowing you to focus on growing your real estate portfolio with confidence.",
      align: "left",
      icon: <AccountBalanceIcon sx={featureIconStyle} />,
      infoGraphic: (
        <div className="card feature-card">
          <div className="card-body">
            <h4>Assets</h4>
            <div className="row">
              <div className="col-md-6">
                <h5
                  className="card-title"
                  style={{ color: "rgb(255,255,255)" }}
                >
                  Cash
                </h5>
                <p className="feature-card-text">$18,941</p>
              </div>
              <div className="col-md-6">
                <h5
                  className="card-title"
                  style={{ color: "rgb(255,255,255)" }}
                >
                  Accounts Recievable
                </h5>
                <p className="feature-card-text">$6,190</p>
              </div>
              <div className="col-md-6">
                <h5
                  className="card-title"
                  style={{ color: "rgb(255,255,255)" }}
                >
                  Land
                </h5>
                <p className="feature-card-text">$476,234.12</p>
              </div>
              <div className="col-md-6">
                <h5
                  className="card-title"
                  style={{ color: "rgb(255,255,255)" }}
                >
                  Inventory
                </h5>
                <p className="feature-card-text">$5,049</p>
              </div>
              <p style={{ color: uiGreen }}>More Accounts</p>
            </div>

            <div style={{ width: "100%" }}>
              <button
                className="btn btn-primary ui-button"
                style={{ float: "right" }}
                type="button"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Streamlined E-Signing for Landlords",
      description:
        "Simplify your leasing process with KeyFlow's E-Sign Lease feature. Upload and customize lease agreements effortlessly, enabling prospective tenants to sign electronically from anywhere. Seamlessly configure terms, clauses, and addenda to suit your needs. Enhance efficiency, reduce paperwork, and expedite tenant onboarding with our secure, user-friendly solution. Say goodbye to printing hassles and hello to streamlined, legally binding electronic signatures for your rental agreements.",
      align: "right",
      icon: <HistoryEduIcon sx={featureIconStyle} />,
      infoGraphic: (
        <div className="card feature-card">
          <div className="card-body">
            <Stack>
              <DrawIcon sx={{ ...featureIconStyle, fontSize: "3rem" }} />
              <div
                style={{
                  width: "100%",
                  borderBottom: "2px solid " + uiGreen,
                  marginBottom: "15px",
                }}
              ></div>
              <UIButton btnText="Sign Now" />
            </Stack>
          </div>
        </div>
      ),
    },
    {
      title: "Seamless Cryptocurrency Rent Payments",
      description:
        "KeyFlow's cryptocurrency payment solution enables tenants to pay rent with Bitcoin, Ethereum, and Monero cryptocurrencies. Our secure, user-friendly platform allows tenants to make payments with ease, while property managers receive payments in their preferred currency. Say goodbye to clunky cryptocurrency transactions and hello to seamless cryptocurrency rent payments with KeyFlow.",
      align: "left",
      icon: <CurrencyBitcoinIcon sx={featureIconStyle} />,
      infoGraphic: (
        <div className="card feature-card">
          <div className="card-body">
            <div>
              <h5>Rent Balance</h5>
              <p>
                0.01535 BTC <span>($2,500)</span>
              </p>
            </div>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}
            >
              <Stack
                direction={"row"}
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <div>
                  <span>Cryptocurrency</span>
                  <select
                    style={{
                      background: "#364658",
                      padding: "10px",
                      width: "100%",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                    }}
                  >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="XMR">XMR</option>
                  </select>
                </div>
                <div>
                  <span>Wallet</span>
                  <select
                    style={{
                      background: "#364658",
                      padding: "10px",
                      width: "100%",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                    }}
                  >
                    <option value={faker.finance.bitcoinAddress()}>
                      {faker.finance.bitcoinAddress()}
                    </option>
                    <option value={faker.finance.ethereumAddress()}>
                      {faker.finance.ethereumAddress()}
                    </option>
                    <option value={faker.finance.ethereumAddress()}>
                      {faker.finance.ethereumAddress()}
                    </option>
                  </select>
                </div>
              </Stack>
              <div>
                <span>Amount</span>
                <input
                  style={{
                    background: "#364658",
                    padding: "10px",
                    width: "100%",
                    border: "none",
                    borderRadius: "5px",
                    color: "white",
                    width: "100%",
                  }}
                  type="number"
                  value={0.00043205}
                />
              </div>
              <div>
                <UIButton btnText="Pay Now" style={{ width: "100%" }} />{" "}
              </div>
            </Stack>
          </div>
        </div>
      ),
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
        <div className="section-header">
          <h2>Let us do the heavy lifting</h2>
          <p>
            Effortlessly manage tenants, automate tasks, streamline finances,
            and optimize property performance with KeyFlow's comprehensive suite
            of powerful features.
          </p>
        </div>
        {featureRows.map((featureRow, index) => {
          return (
            <div className="row feature-row">
              {featureRow.align === "right" && (
                <div className="col-md-6 align-self-center">
                  {featureRow.infoGraphic}
                </div>
              )}

              <div className="col-md-6 align-self-center feature-row-info-column">
                <div>
                  {featureRow.icon}
                  <h2 className="feature-heading">{featureRow.title}</h2>
                  <p>
                    <span style={{ color: "rgb(0, 0, 0)" }}>
                      {featureRow.description}
                    </span>
                    <br />
                  </p>
                </div>
              </div>

              {featureRow.align === "left" && (
                <div className="col-md-6 align-self-center">
                  {featureRow.infoGraphic}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
