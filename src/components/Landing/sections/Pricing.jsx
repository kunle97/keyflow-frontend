import React, { useEffect, useState } from "react";
import { getSubscriptionPlanPrices } from "../../../api/manage_subscriptions";

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getSubscriptionPlanPrices().then((res) => {
      setPlans(res.products);
      console.log(plans);
    });
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
        <div className="row gy-4 gx-md-0 gy-md-0 row-cols-1 row-cols-md-2 row-cols-xl-3 d-md-flex d-xl-flex align-items-md-center">
          {plans.map((plan) => {
            const isStandardPlan =
              plan.product_id ===
              process.env.REACT_APP_STRIPE_STANDARD_PLAN_PRODUCT_ID;
            return (
              <div className={`col ${isStandardPlan ? "offset-xl-2" : ""}`}>
                <div
                  className={`card ${
                    isStandardPlan
                      ? "standard-price-card bg-white"
                      : "bg-primary"
                  }  border-0`}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3
                          className={`fw-bold ${
                            !isStandardPlan ? "text-white" : "text-dark"
                          } mb-0`}
                        >
                          {plan.name}
                        </h3>
                        <h4
                          className={`display-6 fw-bold ${
                            !isStandardPlan ? "text-white" : "text-dark"
                          }`}
                        >
                          ${plan.price}
                        </h4>
                        <p>{!isStandardPlan && "per unit"} per month</p>
                      </div>
                      {!isStandardPlan && (
                        <div>
                          <span className="badge rounded-pill bg-primary text-uppercase bg-white-300">
                            Best Value
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <ul className="list-unstyled">
                        {plan.features.map((feature) => (
                          <li className="d-flex mb-2">
                            <span
                              className={`bs-icon-xs bs-icon-rounded ${
                                isStandardPlan
                                  ? "bs-icon-primary-light"
                                  : "bs-icon-semi-white xs"
                              } bs-icon me-2`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className="bi bi-check-lg"
                              >
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                              </svg>
                            </span>
                            <span>{feature.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      className={`btn btn-primary d-block w-100 ${
                        isStandardPlan ? "ui-button" : "bg-white-300"
                      } `}
                      role="button"
                      href="#"
                    >
                      Join Now
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
