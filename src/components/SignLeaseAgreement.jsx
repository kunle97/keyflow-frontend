import React from "react";
import { uiGreen } from "../constants";
import { Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
  getLeaseAgreementByIdAndApprovalHash,
  signLeaseAgreement,
} from "../api/lease_agreements";
import { useState } from "react";
import AlertModal from "./Dashboard/UIComponents/Modals/AlertModal";
import { generateSigningLink } from "../api/boldsign";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ProgressModal from "./Dashboard/UIComponents/Modals/ProgressModal";
import UIPrompt from "./Dashboard/UIComponents/UIPrompt";
import LandingPageNavbar from "./Landing/LandingPageNavbar";
import useScreen from "../hooks/useScreen";
import { createInvoicesForRenewal } from "../api/tenants";
const SignLeaseAgreement = () => {
  const { lease_agreement_id, approval_hash } = useParams();
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [displayError, setDisplayError] = useState(false);
  const [showSignConfirmation, setShowSignConfirmation] = useState(false);
  const [signResponseMessage, setSignResponseMessage] = useState("");
  const [showSignResponse, setShowSignResponse] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const [renewalMode, setRenewalMode] = useState(false);
  const [signingLink, setSigningLink] = useState(null);
  const [signingLinkIsValid, setSigningLinkIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [unitLeaseTerms, setUnitLeaseTerms] = useState([]);
  const [progressModalText, setProgressModalText] = useState(
    "Loading your lease agreement..."
  );
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const getUnitPreferenceValueByName = (name, unitLeaseTerms) => {
    const preference = unitLeaseTerms.find((pref) => pref.name === name);
    return preference ? preference.value : null; // Return null or handle the case where preference is not found
  };

  //Create a function to sign the lease agreement which calls the API to update the lease agreement
  const handleSignLeaseAgreement = () => {
    setProgressModalText("Signing your lease agreement...");
    setIsLoading(true);
    let date = new Date();
    let end_date;
    if (
      getUnitPreferenceValueByName("rent_frequency", unitLeaseTerms) === "month"
    ) {
      end_date = date.setMonth(
        date.getMonth() +
          parseInt(getUnitPreferenceValueByName("term", unitLeaseTerms))
      );
    } else if (
      getUnitPreferenceValueByName("rent_frequency", unitLeaseTerms) === "year"
    ) {
      end_date = date.setFullYear(
        date.getFullYear() +
          parseInt(getUnitPreferenceValueByName("term", unitLeaseTerms))
      );
    } else if (
      getUnitPreferenceValueByName("rent_frequency", unitLeaseTerms) === "week"
    ) {
      end_date = date.setDate(
        date.getDate() +
          parseInt(getUnitPreferenceValueByName("term", unitLeaseTerms)) * 7
      );
    } else if (
      getUnitPreferenceValueByName("rent_frequency", unitLeaseTerms) === "day"
    ) {
      end_date = date.setDate(
        date.getDate() +
          parseInt(getUnitPreferenceValueByName("term", unitLeaseTerms))
      );
    }

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
        if (renewalMode) {
          //Create the invoices for the lease renewal
          let payload = {
            lease_agreement_id: leaseAgreement.id,
            tenant_id: leaseAgreement.tenant.id,
          };
          createInvoicesForRenewal(payload)
            .then((res) => {
              if (res.status === 200) {
                setSignResponseMessage(
                  "Lease Renewal Agreement Signed Successfully. Click the button below to  be redirected back to your dashboard."
                );
                //REdirect to the tenant dashboard
                setRedirectLink(
                  process.env.REACT_APP_HOSTNAME + "/dashboard/tenant/"
                );
                setIsLoading(false);
              }
            })
            .finally(() => {
              setIsLoading(false);
              setShowSignResponse(true);
              setShowSignConfirmation(false);
            });
        } else {
          //On update success redirect to tenant registration page with approval_hash
          setSignResponseMessage(
            "Lease Agreement Signed Successfully. Click the button below to create your account."
          );
          setShowSignResponse(true);
          setShowSignConfirmation(false);
        }
        setSigningLink(null);
      }
    });
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
          "Your lease agreement has been declined. Please contact your owner for more information."
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
    if (!leaseAgreement) {
      try {
        // Get Lease Agreement from API
        getLeaseAgreementByIdAndApprovalHash({
          lease_agreement_id,
          approval_hash,
        })
          .then((lease_agreement_res) => {
            if (lease_agreement_res.id) {
              setLeaseAgreement(lease_agreement_res);
              setUnitLeaseTerms(
                JSON.parse(lease_agreement_res.rental_unit.lease_terms)
              );
              let redirectLink =
                process.env.REACT_APP_HOSTNAME +
                "/dashboard/tenant/register" +
                "/" +
                lease_agreement_res.id +
                "/" +
                lease_agreement_res.rental_unit.id +
                "/" +
                lease_agreement_res.approval_hash;
                console.log("REDIRECT lInK: ",redirectLink);
              setRedirectLink(redirectLink);
              let payload = {};
              if (lease_agreement_res.tenant) {
                payload = {
                  document_id: lease_agreement_res.document_id,
                  tenant_email: lease_agreement_res.tenant.email,
                  tenant_register_redirect_url: redirectLink,
                  link_validity: "12/31/2030",
                };
                setRenewalMode(true);
              } else {
                payload = {
                  document_id: lease_agreement_res.document_id,
                  tenant_email: lease_agreement_res.tenant_invite
                    ? lease_agreement_res.tenant_invite.email
                    : lease_agreement_res.rental_application.email,
                  tenant_register_redirect_url: redirectLink,
                  link_validity: "12/31/2030",
                };
                setRenewalMode(false);
              }
              if (!signingLink) {
                generateSigningLink(payload).then((res) => {
                  if (res.data.status === 200) {
                    //Set the src of the iframe to the signing link
                    setSigningLink(res.data.data.signLink);
                    setSigningLinkIsValid(true);
                  } else {
                    setSigningLink("invalid");
                    setSigningLinkIsValid(false);
                  }
                });
              }

              //Check that the approval_hash matches the lease agreement's approval_hash
              if (lease_agreement_res.approval_hash !== approval_hash) {
                //Display an error message
                setDisplayError(true);
              }
              if (lease_agreement_res.is_active) {
                //Display an error message
                navigate("/*");
              }
            } else {
              setDisplayError(true);
            }
          })
          .catch((err) => {
            setDisplayError(true);
          });
        setIsLoading(false);
      } catch (err) {
      } finally {
      }
    }
    setIsLoading(false);
    window.addEventListener("message", handleDocumentSigningUpdate);
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleDocumentSigningUpdate);
    };
  }, [leaseAgreement]);
  return (
    <div
      className={!isMobile ? "container" : "container-fluid"}
      style={{ paddingTop: !isMobile ? "105px" : "0px" }}
    >
      <LandingPageNavbar isDarkNav={true} />
      <AlertModal
        open={showErrorMessage}
        title={errorTitle}
        message={errorMessage}
        btnText="Okay"
        onClick={() => {
          navigate(0);
        }}
      />
      <ProgressModal open={isLoading} title={progressModalText} />
      {!displayError ? (
        <>
          {" "}
          <AlertModal
            open={showSignResponse}
            title={"Sign Lease Agreement"}
            message={signResponseMessage}
            btnText="Continue"
            to={redirectLink}
            handleClose={() => setShowSignResponse(false)}
          />
          <div className="row mt-3">
            {signingLink && (
              <div>
                <h2>
                  Sign Lease Agreement for Unit{" "}
                  {leaseAgreement.rental_unit.name} at{" "}
                  {leaseAgreement.rental_unit.rental_property_name}{" "}
                </h2>
                <div className="row">
                  <div className="col-md-12">
                    <iframe
                      src={signingLink}
                      className="card my-3"
                      style={{
                        height: "900px",
                        padding: "0px",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
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
                  message="This lease agreement is either invalid has either already been signed or is not ready to be signed yet. Please contact your owner for more information."
                />
                <p></p>
              </Stack>
            )}
          </div>
        </>
      ) : (
        <AlertModal
          open={displayError}
          title={"Error"}
          message={"There was an error loading this lease agreement."}
          btnText="Okay"
          onClick={() => {
            navigate(0);
          }}
        />
      )}
    </div>
  );
};

export default SignLeaseAgreement;
