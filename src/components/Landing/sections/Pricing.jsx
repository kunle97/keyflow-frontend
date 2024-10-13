import React, { useEffect, useState } from "react";
import { getSubscriptionPlanPrices } from "../../../api/manage_subscriptions";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { uiGreen } from "../../../constants";
import UISwitch from "../../Dashboard/UIComponents/UISwitch";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [isMonthly, setIsMonthly] = useState(true);

  const [staticPlans, setStaticPlans] = useState([
    {
      name: "Beginner",
      description:
        "For those who are just starting out and need to manage a few units",
      price_per_month: 0,
      price_per_year: 0,
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
      price_per_year: 249,
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
      name: "Professional",
      description:
        "For those with a growing portfolio and need to manage more units",
      price_per_month: 0.99,
      price_per_year: 5,
      per_unit: true,
      best_value: false,
      features: [
        "All Features from standard plan",
        "Up to 50 Units (Minimum 10)",
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
      price_per_month: 1.50,
      price_per_year: 10,
      per_unit: true,
      best_value: true,
      features: [
        "All Features from Pro plan",
        "Unlimited Units",
        "Unlimited lease templates",
        "Customizable Reports",
        "Customizable Workflows",
      ],
      trial_message: "First 3 months FREE",
    },
  ]);

  const handleChangeMonthlySwitch = (event) => {
    setIsMonthly(!isMonthly);
  };

  useEffect(() => {
    if (process.env.REACT_APP_ENVIRONMENT !== "development") {
      getSubscriptionPlanPrices()
        .then((res) => {
          setPlans(res.products);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  return (
    <section id="pricing" className="landing-section">
      <div className="container py-4 py-xl-5">
        <div className="text-center mx-auto section-header mb-0 pb-2">
          <h2>Pricing</h2>
          <p className="w-lg-50 text-black">
            Transparent plans tailored for your needs. Explore our flexible
            pricing options designed to fit every property manager's
            requirements and budget.
          </p>
        </div>
        <Stack
          direction={"row"}
          spacing={2}
          alignItems="center"
          justifyContent="center"
          style={{ margin: "5px 0 35px" }}
        >
          <span className="pricing-switch-label">Monthly</span>
          <UISwitch checked={isMonthly} onChange={handleChangeMonthlySwitch} />
          <span className="pricing-switch-label">Yearly</span>
        </Stack>
        <div className="row">
          {staticPlans.map((plan, index) => (
            <div key={index} className="col-12 col-sm-12 col-md-6 col-lg-3 mb-4">
              <div
                className="standard-price-card border-0 h-100"
                style={{
                  background: plan.best_value ? uiGreen : "white",
                }}
              >
                <div style={{ padding: "50px 15px 25px" }}>
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
                      {/* Conditional rendering for the Enterprise plan: Crossed-out price and trial message */}
                      {plan.name === "Enterprise" ? (
                        <Stack direction={"row"} spacing={1} alignItems="center">
                          {/* Crossed-out price with fixed 2 decimal places */}
                          <span style={{ color: "white" }}>
                            <span style={{ textDecoration: "line-through" }}>
                              ${plan.price_per_month.toFixed(2)}
                            </span>{" "}
                            <span style={{ fontSize: "30pt" }}> $0 </span>
                          </span>
                          <Stack spacing={0} style={{ fontSize: "1rem" }}>
                            <span>/unit</span>
                            <span>/month</span>
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack direction={"row"} spacing={1} alignItems="center">
                          <span>
                            $
                            {isMonthly
                              ? plan.price_per_month.toFixed(2)
                              : plan.price_per_year.toFixed(2)}
                          </span>
                          <span style={{ fontSize: "1rem" }}>
                            {plan.per_unit ? (
                              <Stack spacing={0}>
                                <span> /unit</span>
                                <span>{isMonthly ? "/month" : "/year"}</span>
                              </Stack>
                            ) : (
                              <>{isMonthly ? "/month" : "/year"}</>
                            )}
                          </span>
                        </Stack>
                      )}
                    </h2>

                    {/* Free trial message */}
                    {plan.name === "Enterprise" && (
                      <span
                        style={{
                          color: "yellow",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {plan.trial_message}
                      </span>
                    )}

                    <h4
                      style={{
                        marginBottom: "15px",
                        fontSize: "15pt",
                        color: plan.best_value ? "white" : uiGreen,
                      }}
                    >
                      {plan.name}
                    </h4>
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
                      <a
                        href={`/dashboard/owner/register/${index}`}
                        style={{
                          width: "100%",
                        }}
                      >
                        <button
                          className="btn btn-primary"
                          style={{
                            width: "100%",
                            background: "white",
                            color: uiGreen,
                            padding: "8px 0",
                          }}
                        >
                          Sign Up
                        </button>
                      </a>
                    ) : (
                      <a
                        href={`/dashboard/owner/register/${index}`}
                        style={{
                          width: "100%",
                        }}
                      >
                        <UIButton
                          style={{
                            width: "100%",
                            margin: 0,
                          }}
                          btnText="Sign Up"
                        />
                      </a>
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
                          key={index}
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
