import React, { useEffect, useState } from "react";
import { getSubscriptionPlanPrices } from "../../../api/manage_subscriptions";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [plans, setPlans] = useState([]);

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
        <div className="row gy-4 gx-md-0 gy-md-0 row-cols-1 row-cols-md-2 row-cols-xl-3 d-md-flex d-xl-flex align-items-md-center">
          {process.env.REACT_APP_ENVIRONMENT === "development" ? (
            <>
              <div class="col offset-xl-2">
                <div class="card standard-price-card bg-white  border-0">
                  <div class="card-body p-4">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h3 class="fw-bold text-dark mb-0">
                          Landlord Standard Plan
                        </h3>
                        <h4 class="display-6 fw-bold text-dark">$55</h4>
                        <p> per month</p>
                      </div>
                    </div>
                    <div>
                      <ul class="list-unstyled">
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Accept Rent Payments</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>
                            View various analytics for your tenants, units, and
                            properties
                          </span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Manage up to 10 units</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Property, unit and tenant migration</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>
                            Communicate with Tenant directly from the app
                          </span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>
                            Manage and save vendors for maintenance requests
                          </span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Access to mobile app</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Allow tenants to buy Renters Insurance</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Up to 5 lease agreement templates</span>
                        </li>
                      </ul>
                    </div>
                    <a
                      class="btn btn-primary d-block w-100 ui-button "
                      role="button"
                      href="/dashboard/landlord/register"
                    >
                      Join Now
                    </a>
                  </div>
                </div>
              </div>
              <div class="col ">
                <div class="card bg-primary  border-0">
                  <div class="card-body p-4">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h3 class="fw-bold text-white mb-0">
                          Landlord Pro Plan
                        </h3>
                        <h4 class="display-6 fw-bold text-white">$5.5</h4>
                        <p>per unit per month</p>
                      </div>
                      <div>
                        <span class="badge rounded-pill bg-primary text-uppercase bg-white-300">
                          Best Value
                        </span>
                      </div>
                    </div>
                    <div>
                      <ul class="list-unstyled">
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>All Features from standard plan</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Up to 2000 Units (Minimum 10)</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Bulk Management</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>24/7 Customer support</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Mass onboarding</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>List units for rent directly from app</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>List property for sale</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Accept payments in crypto</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Integrated Accounting Software</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Property value estimation</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Unlimited lease agreement templates</span>
                        </li>
                        <li class="d-flex mb-2">
                          <span class="bs-icon-xs bs-icon-rounded bs-icon-semi-white xs bs-icon me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              class="bi bi-check-lg"
                            >
                              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                            </svg>
                          </span>
                          <span>Automate the maintenance request process</span>
                        </li>
                      </ul>
                    </div>
                    <a
                      class="btn btn-primary d-block w-100 bg-white-300 "
                      role="button"
                      href="/dashboard/landlord/register"
                    >
                      Join Now
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            plans.map((plan) => {
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
                      <Link
                        className={`btn btn-primary d-block w-100 ${
                          isStandardPlan ? "ui-button" : "bg-white-300"
                        } `}
                        role="button"
                        to="/dashboard/landlord/register"
                      >
                        Join Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
