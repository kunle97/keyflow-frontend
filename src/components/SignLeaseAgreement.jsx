import React from "react";
import { addMonths, uiGreen } from "../constants";
import { Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
  getLeaseAgreementByIdAndApprovalHash,
  signLeaseAgreement,
} from "../api/lease_agreements";
import { getLeaseTemplateByIdAndApprovalHash } from "../api/lease_templates";
import { useState } from "react";
import AlertModal from "./Dashboard/UIComponents/Modals/AlertModal";
import ConfirmModal from "./Dashboard/UIComponents/Modals/ConfirmModal";
import { generateSigningLink } from "../api/boldsign";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ProgressModal from "./Dashboard/UIComponents/Modals/ProgressModal";
import UIPrompt from "./Dashboard/UIComponents/UIPrompt";
const SignLeaseAgreement = () => {
  const { lease_agreement_id, approval_hash } = useParams();
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [leaseTemplate, setLeaseTemplate] = useState(null);
  const [displayError, setDisplayError] = useState(false);
  const [showSignConfirmation, setShowSignConfirmation] = useState(false);
  const [signResponseMessage, setSignResponseMessage] = useState("");
  const [showSignResponse, setShowSignResponse] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const [signingLink, setSigningLink] = useState(null);
  const [signingLinkIsValid, setSigningLinkIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  //Create a function to sign the lease agreement which calls the API to update the lease agreement
  const handleSignLeaseAgreement = () => {
    if (!leaseTemplate) {
      // Handle the case when leaseTemplate is not available
      setErrorTitle("Error");
      setErrorMessage(
        "Lease term information is not available. Please try again."
      );
      setShowErrorMessage(true);
      return;
    } else {
      let date = new Date();
      let end_date = date.setMonth(date.getMonth() + leaseTemplate.term);
      const data = {
        lease_agreement_id: leaseAgreement.id,
        approval_hash: approval_hash,
        unit_id: leaseAgreement.rental_unit.id,
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(end_date).toISOString().split("T")[0],
        signed_date: new Date().toISOString().split("T")[0],
      };

      signLeaseAgreement(data).then((res) => {
        if (res.status === 200) {
          //On update success redirect to tenant registration page with approval_hash
          setShowSignResponse(true);
          setShowSignConfirmation(false);
          setSignResponseMessage(
            "Lease Agreement Signed Successfully. Click the button below to create your account."
          );
          setSigningLink(null);
        }
      });
    }
  };

  //TODO: implement solutions for remaining onDocumentSigningUpdate cases
  const handleDocumentSigningUpdate = (params) => {
    if (params.origin !== "https://app.boldsign.com") {
      return;
    }

    switch (params.data.action) {
      case "onDocumentSigned":
        // handle document signing success
        handleSignLeaseAgreement();
        break;
      case "onDocumentSigningFailed":
        // handle document signing failure
        setErrorTitle("Error");
        setErrorMessage(
          "There was an error signing your lease agreement. Please try again."
        );
        setShowErrorMessage(true);
        break;
      case "onDocumentReassigned":
        // handle document reassigning success
        setErrorTitle("Document Reassigned");
        setErrorMessage(
          "Your lease agreement has been reassigned. Please check your email for the new signing link."
        );
        setShowErrorMessage(true);
        break;
      case "onDocumentReassigningFailed":
        // handle document reassigning failure
        setErrorTitle("Error");
        setErrorMessage(
          "There was an error reassigning your lease agreement. Please try again."
        );
        setShowErrorMessage(true);
        break;
      case "onDocumentDeclined":
        // handle document declining success
        setErrorTitle("Document Declined");
        setErrorMessage(
          "Your lease agreement has been declined. Please contact your landlord for more information."
        );
        setShowErrorMessage(true);
        break;
      case "onDocumentDecliningFailed":
        // handle document declining failure
        setErrorTitle("Error");
        setErrorMessage("Error declining  document. Please try again");
        setShowErrorMessage(true);
        break;
      default:
        // Display error message
        setErrorTitle("Error");
        setErrorMessage(
          "An Error has occured. Please refresh the page and try again."
        );
        setShowErrorMessage(true);
        break;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (!leaseTemplate && !leaseAgreement) {
      try {
        // Get Lease Agreement from API
        getLeaseAgreementByIdAndApprovalHash({
          lease_agreement_id,
          approval_hash,
        }).then((res) => {
          if (res.id) {
            setLeaseAgreement(res);
            setLeaseTemplate(res.lease_template);
            let redirectLink =
              process.env.REACT_APP_HOSTNAME +
              "/dashboard/tenant/register" +
              "/" +
              res.id +
              "/" +
              res.rental_unit.id +
              "/" +
              res.approval_hash;
            setRedirectLink(redirectLink);
            let payload = {
              document_id: res.document_id,
              tenant_email: res.rental_application.email,
              tenant_register_redirect_url: redirectLink,
              link_validity: "12/31/2030",
            };
            if (!signingLink) {
              generateSigningLink(payload).then((res) => {
                console.log(res);
                if (res.status === 200) {
                  //Set the src of the iframe to the signing link
                  setSigningLink(res.data.signLink);
                  setSigningLinkIsValid(true);
                } else {
                  setSigningLink("invalid");
                  setSigningLinkIsValid(false);
                }
              });
            }

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
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
      }
    }
    setIsLoading(false);
    window.addEventListener("message", handleDocumentSigningUpdate);
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleDocumentSigningUpdate);
    };
  }, [leaseTemplate, leaseAgreement]);
  return (
    <div className="container">
      <AlertModal
        open={showErrorMessage}
        title={errorTitle}
        message={errorMessage}
        btnText="Okay"
        handleClose={() => {
          navigate(0);
        }}
      />
      <ProgressModal open={isLoading} title="Loading your lease agreement..." />
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
            {signingLink && (
              <>
                <h4 className="my-3">Sign Lease Agreement</h4>
                <div className="card my-3">
                  <div className="card-body">
                    <h6 className="card-title">Lease Agreement Overview</h6>
                    {leaseTemplate && (
                      <div className="row">
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Rent
                          </h6>
                          ${leaseTemplate.rent}
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Term
                          </h6>
                          {leaseTemplate.term} Months
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Late Fee
                          </h6>
                          {`$${leaseTemplate.late_fee}`}
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Security Deposit
                          </h6>
                          {`$${leaseTemplate.security_deposit}`}
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Gas Included?
                          </h6>
                          {`${leaseTemplate.gas_included ? "Yes" : "No"}`}
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Electric Included?
                          </h6>
                          {`${leaseTemplate.electric_included ? "Yes" : "No"}`}
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Water Included?
                          </h6>
                          {`${leaseTemplate.water_included ? "Yes" : "No"}`}
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Lease Cancellation Fee
                          </h6>
                          {`$${leaseTemplate.lease_cancellation_fee}`}
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Lease Cancellation Notice period
                          </h6>
                          {`${leaseTemplate.lease_cancellation_notice_period} Month(s)`}
                        </div>
                        <div className="col-sm-6 col-md-4 mb-4">
                          <h6 className="rental-application-lease-heading">
                            Grace period
                          </h6>
                          {`${leaseTemplate.grace_period} Month(s)`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <iframe
                  src={signingLink}
                  className="card my-3"
                  style={{ height: "1200px", padding: "0px" }}
                />
              </>
            )}
            {!signingLink && !signingLinkIsValid && (
              <Stack
                direction={"column"}
                justifyContent={"center"}
                sx={{
                  marginTop: "5rem",
                  height: "100%",
                  width: "100%",
                }}
              >
                <UIPrompt
                  icon={
                    <HistoryEduIcon
                      style={{
                        fontSize: "5rem",
                        color: uiGreen,
                        marginBottom: "1rem",
                      }}
                    />
                  }
                  title="Invalid Lease Agreement Link"
                  message="This lease agreement is either invalid has either already been signed or is not ready to be signed yet. Please contact your landlord for more information."
                />
                <p></p>
              </Stack>
            )}
          </div>
        </>
      ) : (
        <h1>There was an error</h1>
      )}
    </div>
  );
};

export default SignLeaseAgreement;
