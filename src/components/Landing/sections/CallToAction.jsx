import React from "react";

const CallToAction = () => {
  return (
    <section className="newsletter-subscribe py-4 py-xl-5 landing-section">
      <div className="container">
        <div className="text-center mx-auto section-header">
          <h2 className="display-6 fw-bold">
            Ready to save time and enjoy a life of true freedom?
          </h2>
          <p className="text-muted">
            Curae hendrerit donec commodo hendrerit egestas tempus, turpis
            facilisis nostra nunc. Vestibulum dui eget ultrices.
          </p>
        </div>
        <form className="d-flex justify-content-center flex-wrap" method="post">
          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Your Email"
            />
          </div>
          <div className="mb-3">
            <button className="btn btn-primary ms-2 ui-button" type="submit">
              Request Demo
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CallToAction;
