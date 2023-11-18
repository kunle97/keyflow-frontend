import React from "react";

const Testimonials = () => {
  return (
    <div className="container py-4 py-xl-5">
      <div className="row mb-5">
        <div className="col-md-8 col-xl-6 text-center mx-auto section-header">
          <h2>Endless satisfied landlords and tenants worldwide</h2>
        </div>
      </div>
      <div className="row gy-4 row-cols-1 row-cols-sm-2 row-cols-lg-3">
        <div className="col">
          <div>
            <p className="bg-dark border rounded border-0 border-light p-4">
              Nisi sit justo faucibus nec ornare amet, tortor torquent. Blandit
              class dapibus, aliquet morbi.
            </p>
            <div className="d-flex">
              <img
                className="rounded-circle flex-shrink-0 me-3 fit-cover"
                width={50}
                height={50}
                src="https://cdn.bootstrapstudio.io/placeholders/1400x800.png"
              />
              <div>
                <p className="fw-bold text-primary mb-0">John Smith</p>
                <p className="text-muted mb-0">Erat netus</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div>
            <p className="bg-dark border rounded border-0 border-light p-4">
              Nisi sit justo faucibus nec ornare amet, tortor torquent. Blandit
              class dapibus, aliquet morbi.
            </p>
            <div className="d-flex">
              <img
                className="rounded-circle flex-shrink-0 me-3 fit-cover"
                width={50}
                height={50}
                src="https://cdn.bootstrapstudio.io/placeholders/1400x800.png"
              />
              <div>
                <p className="fw-bold text-primary mb-0">John Smith</p>
                <p className="text-muted mb-0">Erat netus</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div>
            <p className="bg-dark border rounded border-0 border-light p-4">
              Nisi sit justo faucibus nec ornare amet, tortor torquent. Blandit
              class dapibus, aliquet morbi.
            </p>
            <div className="d-flex">
              <img
                className="rounded-circle flex-shrink-0 me-3 fit-cover"
                width={50}
                height={50}
                src="https://cdn.bootstrapstudio.io/placeholders/1400x800.png"
              />
              <div>
                <p className="fw-bold text-primary mb-0">John Smith</p>
                <p className="text-muted mb-0">Erat netus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
