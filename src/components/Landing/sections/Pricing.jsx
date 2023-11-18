import React from "react";

const Pricing = () => {
  return (
    <section id="pricing" className="landing-section">
      <div className="container py-4 py-xl-5">
        <div className="text-center mx-auto section-header">
          <h2>Pricing</h2>
          <p className="w-lg-50">
            Curae hendrerit donec commodo hendrerit egestas tempus, turpis
            facilisis nostra nunc. Vestibulum dui eget ultrices.
          </p>
        </div>
        <div className="row gy-4 gx-md-0 gy-md-0 row-cols-1 row-cols-md-2 row-cols-xl-3 d-md-flex d-xl-flex align-items-md-center">
          <div className="col offset-xl-2">
            <div className="card standard-price-card bg-white border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="fw-bold mb-0 text-black">Standard Plan</h3>
                    <h4 className="display-6 fw-bold text-black">$55</h4>
                    <p>per Month</p>
                  </div>
                </div>
                <div>
                  <ul className="list-unstyled">
                    <li className="d-flex mb-2">
                      <span className="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
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
                      <span>Lectus ut nibh quam, felis porttitor.</span>
                    </li>
                    <li className="d-flex mb-2">
                      <span className="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
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
                      <span>Ante nec venenatis etiam lacinia.</span>
                    </li>
                    <li className="d-flex mb-2">
                      <span className="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon me-2">
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
                      <span>Porta suscipit netus ad ac.</span>
                    </li>
                  </ul>
                </div>
                <a
                  className="btn btn-primary d-block w-100 ui-button"
                  role="button"
                  href="#"
                >
                  Join Now
                </a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-white bg-primary border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="fw-bold text-white mb-0">Pro Plan</h3>
                    <h4 className="display-6 fw-bold text-white">$5.50</h4>
                    <p>per unit per month</p>
                  </div>
                  <div>
                    <span className="badge rounded-pill bg-primary text-uppercase bg-white-300">
                      Best Value
                    </span>
                  </div>
                </div>
                <div>
                  <ul className="list-unstyled">
                    <li className="d-flex mb-2">
                      <span className="bs-icon-xs bs-icon-rounded bs-icon-semi-white bs-icon me-2 xs">
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
                      <span>Lectus ut nibh quam, felis porttitor.</span>
                    </li>
                    <li className="d-flex mb-2">
                      <span className="bs-icon-xs bs-icon-rounded bs-icon-semi-white bs-icon me-2 xs">
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
                      <span>Ante nec venenatis etiam lacinia.</span>
                    </li>
                    <li className="d-flex mb-2">
                      <span className="bs-icon-xs bs-icon-rounded bs-icon-semi-white bs-icon me-2 xs">
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
                      <span>Porta suscipit netus ad ac.</span>
                    </li>
                    <li className="d-flex mb-2">
                      <span className="bs-icon-xs bs-icon-rounded bs-icon-semi-white bs-icon me-2 xs">
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
                      <span>Morbi praesent aptent integer at.</span>
                    </li>
                    <li className="d-flex mb-2">
                      <span className="bs-icon-xs bs-icon-rounded bs-icon-semi-white bs-icon me-2 xs">
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
                      <span>Nisl potenti ut auctor lobortis.</span>
                    </li>
                  </ul>
                </div>
                <a
                  className="btn btn-primary d-block w-100 bg-white-300"
                  role="button"
                  href="#"
                >
                  Join Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
