import React, { useEffect, useState } from "react";
import {
  getLeaseRenewalRequestById,
  getTenantLeaseRenewalRequests,
  signLeaseAgreementRenewal,
} from "../../../../../api/lease_renewal_requests";
import { useParams } from "react-router";
import { getLeaseAgreementByLeaseRenewalRequestId } from "../../../../../api/lease_agreements";
import { generateSigningLink } from "../../../../../api/boldsign";
import { authUser } from "../../../../../constants";
import ProgressModal from "../../../UIComponents/Modals/ProgressModal";
const TenantLeaseRenewalRequestDetail = () => {
  const { id } = useParams();
  const [leaseRenewalRequest, setLeaseRenewalRequest] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [leaseTemplate, setLeaseTemplate] = useState(null); //
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [signingLinkIsValid, setSigningLinkIsValid] = useState(false);
  const [signingLink, setSigningLink] = useState(null);

  const handleSignLeaseAgreement = () => {
    setIsLoading(true);
    let payload = {
      lease_agreement_id: leaseAgreement.id,
      lease_renewal_request_id: leaseRenewalRequest.id,
    };
    signLeaseAgreementRenewal(payload)
      .then((res) => {
        console.log("Sign Lease Agreement Renewal: ", res);
        if (res.status === 200) {
          setAlertModalTitle("Success");
          setAlertModalMessage("Lease Agreement Signed Successfully");
          setShowAlertModal(true);
        } else {
          setAlertModalTitle("Error");
          setAlertModalMessage(
            "There was an error signing your lease agreement. Please try again."
          );
          setShowAlertModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "There was an error signing your lease agreement. Please try again."
        );
        setShowAlertModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setIsLoading(false);
  };

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
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "There was an error signing your lease agreement. Please try again."
        );
        setShowAlertModal(true);
        break;
      case "onDocumentReassigned":
        // handle document reassigning success
        setAlertModalTitle("Document Reassigned");
        setAlertModalMessage(
          "Your lease agreement has been reassigned. Please check your email for the new signing link."
        );
        setShowAlertModal(true);
        break;
      case "onDocumentReassigningFailed":
        // handle document reassigning failure
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "There was an error reassigning your lease agreement. Please try again."
        );
        setShowAlertModal(true);
        break;
      case "onDocumentDeclined":
        // handle document declining success
        setAlertModalTitle("Document Declined");
        setAlertModalMessage(
          "Your lease agreement has been declined. Please contact your landlord for more information."
        );
        setShowAlertModal(true);
        break;
      case "onDocumentDecliningFailed":
        // handle document declining failure
        setAlertModalTitle("Error");
        setAlertModalMessage("Error declining  document. Please try again");
        setShowAlertModal(true);
        break;
      default:
        // Display error message
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "An Error has occured. Please refresh the page and try again."
        );
        setShowAlertModal(true);
        break;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      if (!leaseRenewalRequest || !leaseTemplate) {
        getTenantLeaseRenewalRequests()
          .then((res) => {
            let lease_renewal_requests = res.data;
            let lease_renewal_request = lease_renewal_requests.find(
              (lease_renewal_request) =>
                lease_renewal_request.id === parseInt(id)
            );
            console.log("LRR", lease_renewal_request);
            setLeaseRenewalRequest(lease_renewal_request);
          })
          .catch((err) => {
            console.log(err);
            setAlertModalTitle("Error");
            setAlertModalMessage(
              "Something went wrong. Please try again later."
            );
            setShowAlertModal(true);
          });
        getLeaseAgreementByLeaseRenewalRequestId(id)
          .then((res) => {
            let lease_agreement = res.data;
            setLeaseAgreement(lease_agreement);
            setLeaseTemplate(lease_agreement.lease_template);
            let payload = {
              document_id: lease_agreement.document_id,
              tenant_email: authUser.email,
              tenant_register_redirect_url:
                "/dashboard/tenant/lease-renwal-requests",
              link_validity: "12/31/2030",
            };
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
          })
          .catch((err) => {
            console.error(err);
            setAlertModalTitle("Error");
            setAlertModalMessage(
              "Something went wrong. Please try again later."
            );
            setShowAlertModal(true);
          });
      }
    } catch (err) {
      console.log(err);
      setAlertModalTitle("Error");
      setAlertModalMessage("Something went wrong. Please try again later.");
      setShowAlertModal(true);
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
    window.addEventListener("message", handleDocumentSigningUpdate);
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleDocumentSigningUpdate);
    };
  }, [signingLink, leaseTemplate]);

  return (
    <div className="row">
      <ProgressModal show={isLoading} title={"Please Wait..."} />
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <span></span>
            <h4 className="card-title ui-card-title">
              Lease Agreement Overview
            </h4>
            {leaseTemplate && (
              <div className="row">
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">Rent</h6>$
                  {leaseTemplate.rent}
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">Term</h6>
                  {leaseRenewalRequest.request_term} Months
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">Late Fee</h6>
                  {`$${leaseTemplate.late_fee}`}
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">
                    Security Deposit
                  </h6>
                  {`$${leaseTemplate.security_deposit}`}
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">
                    Gas Included?
                  </h6>
                  {`${leaseTemplate.gas_included ? "Yes" : "No"}`}
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">
                    Electric Included?
                  </h6>
                  {`${leaseTemplate.electric_included ? "Yes" : "No"}`}
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">
                    Water Included?
                  </h6>
                  {`${leaseTemplate.water_included ? "Yes" : "No"}`}
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">
                    Lease Cancellation Fee
                  </h6>
                  {`$${leaseTemplate.lease_cancellation_fee}`}
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">
                    Lease Cancellation Notice period
                  </h6>
                  {`${leaseTemplate.lease_cancellation_notice_period} Month(s)`}
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <h6 className="rental-application-lease-heading">
                    Grace period
                  </h6>
                  {`${leaseTemplate.grace_period} Month(s)`}
                </div>
              </div>
            )}
            {/*TODO: Add Embeded SIgning iFrame*/}
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <iframe
          src={signingLink}
          className="card my-3"
          style={{ height: "1200px", padding: "0px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default TenantLeaseRenewalRequestDetail;
