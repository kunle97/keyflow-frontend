import React from "react";
import { addMonths, uiGreen } from "../constants";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
  getLeaseAgreementByIdAndApprovalHash,
  getLeaseTermByIdAndApprovalHash,
  signLeaseAgreement,
} from "../api/api";
import { useState } from "react";
import AlertModal from "./Dashboard/UIComponents/Modals/AlertModal";
import ConfirmModal from "./Dashboard/UIComponents/Modals/ConfirmModal";
const SignLeaseAgreement = () => {
  const { lease_agreement_id, approval_hash } = useParams();
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [leaseTerm, setLeaseTerm] = useState(null);
  const [displayError, setDisplayError] = useState(false);
  const [showSignConfirmation, setShowSignConfirmation] = useState(false);
  const [signResponseMessage, setSignResponseMessage] = useState("");
  const [showSignResponse, setShowSignResponse] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const navigate = useNavigate();

  //Create a function to sign the lease agreement which calls the API to update the lease agreement
  const handleSignLeaseAgreement = () => {
    //(update the Lease Agreement with the start_date,  end_date, approval_hash, is_active, signed_date,etc)
    let date = new Date();
    let end_date = date.setMonth(date.getMonth() + leaseTerm.term);
    const data = {
      lease_agreement_id: leaseAgreement.id,
      approval_hash: approval_hash,
      unit_id: leaseAgreement.rental_unit,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(end_date).toISOString().split("T")[0],
      signed_date: new Date().toISOString().split("T")[0],
      // document_id: getDocumentIdFromDocuSignOrSomthing(),
    };
    let redirectLink =
      process.env.REACT_APP_HOSTNAME +
      "/dashboard/tenant/register" +
      "/" +
      leaseAgreement.id +
      "/" +
      leaseAgreement.rental_unit +
      "/" +
      leaseAgreement.approval_hash;

    signLeaseAgreement(data).then((res) => {
      if (res.status === 200) {
        //On update success redirect to tenant registration page with approval_hash
        setRedirectLink(redirectLink);
        setShowSignResponse(true);
        setShowSignConfirmation(false);
        setSignResponseMessage(
          "Lease Agreement Signed Successfully. Click the button below to create your account."
        );
      }
    });
  };

  useEffect(() => {
    // Get Lease Agreement from API
    getLeaseAgreementByIdAndApprovalHash({
      lease_agreement_id,
      approval_hash,
    }).then((res) => {
      if (res.id) {
        setLeaseAgreement(res);
        getLeaseTermByIdAndApprovalHash({
          lease_term_id: res.lease_term,
          approval_hash,
        }).then((res) => {
          setLeaseTerm(res);
        });
        //Check that the approval_hash matches the lease agreement's approval_hash
        if (res.approval_hash !== approval_hash) {
          //Display an error message
          setDisplayError(true);
        }
        if (res.is_active) {
          //Display an error message
          navigate("/*");
        }
      } else {
        setDisplayError(true);
      }
    });
  }, []);
  return (
    <div className="container">
      {!displayError ? (
        <>
          {" "}
          <AlertModal
            open={showSignResponse}
            title={"Sign Lease Agreement"}
            message={signResponseMessage}
            btnText="Create Account"
            to={redirectLink}
            handleClose={() => setShowSignResponse(false)}
          />
          <ConfirmModal
            open={showSignConfirmation}
            title={"Sign Lease Agreement"}
            message="Are you sure you want to sign this lease agreement? Once signed you are legally bound to the terms of this lease agreement."
            cancelBtnText="Cancel"
            confirmBtnText="Confirm"
            handleClose={() => setShowSignConfirmation(false)}
            handleConfirm={handleSignLeaseAgreement}
            handleCancel={() => setShowSignConfirmation(false)}
          />
          <div className="row">
            <h4 className="my-3">Sign Lease Agreement</h4>
            <div className="card my-3">
              <div className="card-body">
                <h6 className="card-title">Lease Agreement Overview</h6>
                {leaseTerm && (
                  <div className="row">
                    <div className="col-sm-6 col-md-4 mb-4">
                      <h6 className="rental-application-lease-heading">Rent</h6>
                      ${leaseTerm.rent}
                    </div>
                    <div className="col-sm-6 col-md-4 mb-4">
                      <h6 className="rental-application-lease-heading">Term</h6>
                      {leaseTerm.term} Months
                    </div>
                    <div className="col-sm-6 col-md-4 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Late Fee
                      </h6>
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
                    <div className="col-sm-6 col-md-4 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Grace period
                      </h6>
                      {`${leaseTerm.grace_period} Month(s)`}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="card my-3" style={{ height: "850px" }}>
              {/* PDF Viewer Goes Here */}
            </div>

            <Button
              variant="contained"
              sx={{ background: uiGreen, textTransform: "none" }}
              onClick={() => setShowSignConfirmation(true)}
            >
              Sign Lease Agreement
            </Button>
          </div>
        </>
      ) : (
        <h1>There was an error</h1>
      )}
    </div>
  );
};

export default SignLeaseAgreement;
