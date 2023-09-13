import React from "react";
import { useState } from "react";
import { getTenantDashboardData } from "../../../api/api";
import { useEffect } from "react";

const MyLeaseAgreement = () => {
  const [unit, setUnit] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [leaseTerm, setLeaseTerm] = useState(null);
  useEffect(() => {
    //Retrieve the unit
    getTenantDashboardData().then((res) => {
      console.log(res);
      setUnit(res.unit);
      setLeaseAgreement(res.lease_agreement);
      setLeaseTerm(res.lease_term);
    });
  }, []);

  return (
    <div className="row">
      <h4 className="my-3">Sign Lease Agreement</h4>
      <div className="card my-3">
        <div className="card-body">
          <h6 className="card-title">Lease Agreement Overview</h6>
          {leaseTerm && (
            <div className="row">
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">Rent</h6>$
                {leaseTerm.rent}
              </div>
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">Term</h6>
                {leaseTerm.term} Months
              </div>
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">Late Fee</h6>
                {`$${leaseTerm.late_fee}`}
              </div>
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">
                  Security Deposit
                </h6>
                {`$${leaseTerm.security_deposit}`}
              </div>
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">
                  Gas Included?
                </h6>
                {`${leaseTerm.gas_included ? "Yes" : "No"}`}
              </div>
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">
                  Electric Included?
                </h6>
                {`${leaseTerm.electric_included ? "Yes" : "No"}`}
              </div>
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">
                  Water Included?
                </h6>
                {`${leaseTerm.water_included ? "Yes" : "No"}`}
              </div>
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">
                  Lease Cancellation Fee
                </h6>
                {`$${leaseTerm.lease_cancellation_fee}`}
              </div>
              <div className="col-sm-6 col-md-4 mb-4">
                <h6 className="rental-application-lease-heading">
                  Lease Cancellation Notice period
                </h6>
                {`${leaseTerm.lease_cancellation_notice_period} Month(s)`}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="card my-3" style={{ height: "850px" }}>
        {/* PDF Viewer Goes Here */}
      </div>

    </div>
  );
};

export default MyLeaseAgreement;
