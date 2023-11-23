import React, { useState } from "react";

import CallToActionForm from "./CallToActionForm";
const CallToAction = () => {

  return (
    <section id="call-to-action" className="newsletter-subscribe py-4 py-xl-5 landing-section">
      <div className="container">
        <div className="text-center mx-auto section-header">
          <h2 className="display-6 fw-bold">
            Ready to save time and enjoy a life of true freedom?
          </h2>
          <p className="text-muted">
            Unlock efficiency and freedom in property management today.
            Experience seamless workflows with KeyFlow. Start your journey to
            stress-free management now!
          </p>
        </div>
        <CallToActionForm />
      </div>
    </section>
  );
};

export default CallToAction;
