import React, { useEffect, useState } from "react";
import { getSubscriptionPlanPrices } from "../../../api/manage_subscriptions";
import { Link } from "react-router-dom";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { Chip, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { uiGreen } from "../../../constants";

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  const [staticPlans, setStaticPlans] = useState([
    {
      name: "Beginner",
      description:
        "For those who are just starting out and need to manage a few units",
      price_per_month: 0,
      per_unit: false,
      best_value: false,
      features: [
        "Accept Rent Payments",
        "Manage up to 4 units",
        "Communicate with Tenants",
        "Manage maintenance requests",
        "Access to mobile app",
      ],
    },
    {
      name: "Standard",
      description:
        "For those who are getting the hang of things and need to manage more units",
      price_per_month: 29,
      per_unit: false,
      best_value: false,
      features: [
        "Accept Rent Payments",
        "Customizable Notifications",
        "Detailed analytics and reports",
        "Manage up to 10 units",
        "Property and Tenant migration",
        "Communicate with Tenant ",
        "Manage maintenance requests",
        "Access to mobile app",
        "Renters insurance for tenants",
        "5 lease agreement templates",
      ],
    },
    {
      name: "Pro",
      description:
        "For those with a growing portfolio and need to manage more units",
      price_per_month: 0.65,
      per_unit: true,
      best_value: true,
      features: [
        "All Features from standard plan",
        "Up to 2000 Units (Minimum 10)",
        "Bulk Management",
        "24/7 Customer support",
        "Mass onboarding",
        "List units for rent directly ",
        "List property for sale",
        "Accept payments in crypto",
      ],
    },
    {
      name: "Enterprise",
      description:
        "For those managing large portfolios and need a custom solution",
      price_per_month: 0.99,
      per_unit: true,
      best_value: false,
      features: [
        "All Features from Pro plan",
        "Unlimited Units",
        "Unlimited lease templates",
        "Customizable Reports",
        "Customizable Workflows",
      ],
    },
  ]);
  useEffect(() => {
    if (process.env.REACT_APP_ENVIRONMENT !== "development") {
      getSubscriptionPlanPrices().then((res) => {
        setPlans(res.products);
        console.log(plans);
      });
    }
  }, []);
  return (
    <section id="pricing" className="landing-section">
      <div className="container py-4 py-xl-5">
        <div className="text-center mx-auto section-header">
          <h2>Pricing</h2>
          <p className="w-lg-50">
            Transparent plans tailored for your needs. Explore our flexible
            pricing options designed to fit every property manager's
            requirements and budget.
          </p>
        </div>
        <div className="row ">
          {staticPlans.map((plan, index) => (
            <div className="col-md-3">
              <div className="standard-price-card bg-white border-0">
                <div
                  style={{
                    padding: "50px 15px 25px",
                    background: plan.best_value ? uiGreen : "white",
                  }}
                >
                  <Stack
                    direction={"column"}
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <h2
                      style={{
                        fontSize: "30pt",
                        margin: 0,
                        fontWeight: "600",
                        color: plan.best_value ? "white" : "black",
                      }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <span>${plan.price_per_month}</span>
                        <span
                          style={{
                            fontSize: "1rem",
                          }}
                        >
                          {plan.per_unit ? (
                            <Stack spacing={0.3}>
                              <span> /unit</span>
                              <span>/month</span>
                            </Stack>
                          ) : (
                            "/month"
                          )}
                        </span>
                      </Stack>
                    </h2>
                    <h4
                      style={{
                        marginBottom: "15px",
                        fontSize: "15pt",

                        color: plan.best_value ? "white" : uiGreen,
                      }}
                    >
                      {plan.name} Plan
                    </h4>{" "}
                    <p
                      style={{
                        margin: 0,
                        textAlign: "center",
                        marginBottom: "15px",
                        padding: "0 15px",
                        fontSize: "10pt",
                      }}
                      className={plan.best_value ? "text-white" : "text-muted"}
                    >
                      {plan.description}
                    </p>
                    {plan.best_value ? (
                      <button
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          background: "white",
                          color: uiGreen,
                          padding: "8px 0",
                        }}
                      >
                        Join Now
                      </button>
                    ) : (
                      <UIButton
                        style={{
                          width: "100%",
                          margin: 0,
                        }}
                        btnText="Join Now"
                      />
                    )}
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        padding: "10px 0",
                        marginTop: "20px",
                      }}
                    >
                      {plan.features.map((feature, index) => (
                        <li
                          style={{
                            marginBottom: "10px",
                            textAlign: "left",
                            color: plan.best_value ? "white" : "black",
                          }}
                        >
                          <CheckIcon
                            sx={{
                              color: plan.best_value ? "white" : uiGreen,
                              fontSize: "1rem",
                            }}
                          />{" "}
                          {feature}
                        </li>
                      ))}
                    </ul>
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

export default Pricing;
