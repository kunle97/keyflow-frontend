import React from "react";

const Contact = () => {
  return (
    <section
      id="#contact"
      className="position-relative py-4 py-xl-5 landing-section"
    >
      <div className="container position-relative pt-5">
        <div className="row my-5">
          <div className="col-md-8 col-xl-6 text-center mx-auto">
            <h2 className="text-dark"> Contact us</h2>
            <p className="w-lg-50 text-dark">
              Get in touch today. Our team is ready to assist you with any
              inquiries or support needs regarding KeyFlow's property management
              solutions.
            </p>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-md-6 col-lg-4 col-xl-4">
            <div className="d-flex flex-column justify-content-center align-items-start h-100">
              <div className="d-flex align-items-center p-3">
                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="bi bi-envelope"
                  >
                    <path
                      fillRule="evenodd"
                      d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
                    />
                  </svg>
                </div>
                <div className="px-2">
                  <h6 className="mb-0 text-dark">Email</h6>
                  <p className="mb-0 text-dark">keyflowsoftware@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-5 col-xl-4 offset">
            <div>
              <form className="p-3 p-xl-4" method="post">
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="text"
                    id="name-1"
                    name="name"
                    placeholder="Name"
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="email"
                    id="email-1"
                    name="email"
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    id="message-1"
                    name="message"
                    rows={6}
                    placeholder="Message"
                    defaultValue={""}
                  />
                </div>
                <div>
                  <button
                    className="btn btn-primary d-block w-100 ui-button"
                    type="submit"
                  >
                    Send{" "}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
