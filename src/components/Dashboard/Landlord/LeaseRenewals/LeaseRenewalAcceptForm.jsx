import React, { useEffect, useState } from "react";
import {
  approveLeaseRenewalRequest,
  getLeaseRenewalRequestById,
} from "../../../../api/lease_renewal_requests";
import { useNavigate, useParams } from "react-router";
import UIButton from "../../UIComponents/UIButton";
import { authUser, uiGreen, uiRed } from "../../../../constants";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import UIPrompt from "../../UIComponents/UIPrompt";
import { Stack } from "@mui/material";
import { getLeaseTemplatesByUser } from "../../../../api/lease_templates";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { sendDocumentToUser } from "../../../../api/boldsign";
import { makeId } from "../../../../helpers/utils";
import {
  createLeaseAgreement,
  getLeaseAgreementsByTenant,
} from "../../../../api/lease_agreements";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { updateLeaseRenewalRequest } from "../../../../api/lease_renewal_requests";
import CreateLeaseTemplate from "../LeaseTemplate/CreateLeaseTemplate/CreateLeaseTemplate";
import { set } from "react-hook-form";
import { updateUnit } from "../../../../api/units";

const LeaseRenewalAcceptForm = () => {
  const { id } = useParams();
  const [leaseRenewalRequest, setLeaseRenewalRequest] = useState(null);
  const [leaseTemplates, setLeaseTemplates] = useState([]);
  const [currentLeaseAgreement, setCurrentLeaseAgreement] = useState(null);
  const [currentLeaseTemplate, setCurrentLeaseTemplate] = useState(null); // Used to check if the current lease template term is different from the lease renewal request term [Optional
  const [currentTemplateId, setCurrentTemplateId] = useState(null); //
  const [selectedLeaseTemplate, setSelectedLeaseTemplate] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalLink, setAlertModalLink] = useState(""); // Used to show a link in the alert modal [Optional]
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Used to show the progress modal when the user clicks the submit button
  const [openAcceptModal, setOpenAcceptModal] = useState(false);
  const [changeLeaseTermMode, setChangeLeaseTermMode] = useState("new"); // Values: new, existing
  const [viewMode, setViewMode] = useState("review"); //Values: Review,  change_terms, submit_confirmation
  const [documentMode, setDocumentMode] = useState("existing"); // Values: new, existing
  const navigate = useNavigate();

  const handleAccept = async (e) => {
    setIsSubmitting(true);
    setOpenAcceptModal(false);

    if (leaseRenewalRequest.status !== "pending") {
      setAlertModalTitle("Lease Renewal Request Already Accepted");
      setAlertModalMessage("This lease renewal request was already accepted.");
      setShowAlertModal(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const renewalPayload = {
        lease_template_id: currentLeaseTemplate.id,
        lease_renewal_request_id: leaseRenewalRequest.id,
        current_lease_agreement_id: currentLeaseAgreement.id,
      };

      const approveRenewalRequestResponse = await approveLeaseRenewalRequest(
        renewalPayload
      );

      if (approveRenewalRequestResponse.status !== 204) {
        throw new Error("Approval of renewal request failed");
      }

      const docPayload = {
        template_id: currentTemplateId,
        tenant_first_name: leaseRenewalRequest.tenant.user.first_name,
        tenant_last_name: leaseRenewalRequest.tenant.user.last_name,
        tenant_email: leaseRenewalRequest.tenant.email,
        document_title: `${leaseRenewalRequest.tenant.user.first_name} ${leaseRenewalRequest.tenant.user.last_name} Lease Agreement (Renewal) for unit ${currentLeaseAgreement.rental_unit.name}`,
        message: "Please sign the lease renewal agreement",
      };

      console.log("Doc Payload: ", docPayload);

      const sendDocResponse = await sendDocumentToUser(docPayload);

      if (!sendDocResponse.documentId) {
        throw new Error("Sending document failed");
      }

      const start_date = new Date(leaseRenewalRequest.move_in_date);
      const end_date = new Date(
        start_date.getFullYear(),
        start_date.getMonth() + leaseRenewalRequest.request_term,
        start_date.getDate()
      );
      const formattedStartDate = start_date.toISOString().split("T")[0];
      const formattedEndDate = end_date.toISOString().split("T")[0];

      const leaseAgreementPayload = {
        rental_unit: leaseRenewalRequest.rental_unit.id,
        tenant: leaseRenewalRequest.tenant.id,
        user: authUser.user_id,
        approval_hash: makeId(64),
        lease_template: currentLeaseTemplate.id,
        document_id: sendDocResponse.documentId,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        lease_renewal_request: leaseRenewalRequest.id,
      };

      const createLeaseAgreementResponse = await createLeaseAgreement(
        leaseAgreementPayload
      );

      if (!createLeaseAgreementResponse?.response?.data?.id) {
        throw new Error("Lease agreement creation failed.");
      }

      //If the lease_renewal_request's rental unit does not equal the lease agreeement's update the unit's is_occupied status to true. Also set the unit's lease_template to current leaseTemplate
      const updateRentalUnitPayload = {
        is_occupied: true,
        lease_template: currentLeaseTemplate.id,
        tenant: leaseRenewalRequest.tenant.id,
      };
      await updateUnit(
        leaseRenewalRequest.rental_unit.id,
        updateRentalUnitPayload
      ).then((res) => {
        console.log(res);
        if (res.id) {
          console.log("Successfully updated rental unit");
        } else {
          console.log("Failed to update rental unit");
        }
      });

      setAlertModalTitle("Success");
      setAlertModalMessage(
        "The lease renewal request was accepted, and the tenant was notified."
      );
      setShowAlertModal(true);
    } catch (error) {
      setAlertModalTitle("Error");
      setAlertModalMessage(
        `An error occurred: ${error.message}. Please try again later.`
      );
      //Update the lease renewal request status to pending
      const updateLeaseRenewalRequestPayload = {
        status: "pending",
      };
      await updateLeaseRenewalRequest(
        leaseRenewalRequest.id,
        updateLeaseRenewalRequestPayload
      );
      setShowAlertModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  //Create a fucntion to check if the current lease template term is different from the lease renewal request term
  const isCurrentLeaseTemplateTermDifferent = (
    currentLeaseTemplate,
    leaseRenewal
  ) => {
    if (currentLeaseTemplate) {
      if (currentLeaseTemplate.term !== leaseRenewal.request_term) {
        setAlertModalTitle("Lease Template Term Mismatch");
        setAlertModalMessage(
          "The Tenant chose a different lease term than the current lease template. You will need to create a new lease template to accept this lease renewal request."
        );
        setShowAlertModal(true);
        return true; //Trigger an alert to navigate user to create the new lease template
      }
    }
    return false;
  };

  useEffect(() => {
    if (!currentLeaseAgreement || !currentLeaseTemplate) {
      setIsLoading(true);
      getLeaseRenewalRequestById(id)
        .then((lease_renewal_res) => {
          console.log(lease_renewal_res);
          if (lease_renewal_res.status === 200) {
            setLeaseRenewalRequest(lease_renewal_res.data);
            if (!currentLeaseAgreement) {
              getLeaseAgreementsByTenant(lease_renewal_res.data.tenant.id)
                .then((lease_agreements_res) => {
                  console.log(lease_agreements_res);
                  if (lease_agreements_res.status === 200) {
                    let lease_agreements = lease_agreements_res.data;
                    let current_lease_agreement = lease_agreements.find(
                      (lease_agreement) => lease_agreement.is_active === true
                    );
                    setCurrentLeaseAgreement(current_lease_agreement);
                    setCurrentLeaseTemplate(
                      current_lease_agreement.lease_template
                    );
                    setCurrentTemplateId(
                      current_lease_agreement.lease_template.template_id
                    );
                  } else {
                    navigate("/dashboard/landlord/lease-renewal-requests/");
                    setAlertModalTitle("Error");
                    setAlertModalMessage("Something went wrong!");
                    setShowAlertModal(true);
                  }
                })
                .then(() => {
                  setIsLoading(false);
                });
            }
          } else {
            navigate("/dashboard/landlord/lease-renewal-requests/");
            setAlertModalTitle("Error");
            setAlertModalMessage("Something went wrong!");
            setShowAlertModal(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong!");
          setShowAlertModal(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
      getLeaseTemplatesByUser().then((res) => {
        setLeaseTemplates(res.data);
      });
    } else {
      // Call isCurrentLeaseTemplateTermDifferent here, after setting the states
      isCurrentLeaseTemplateTermDifferent(
        currentLeaseTemplate,
        leaseRenewalRequest
      );
    }
  }, [currentLeaseAgreement, currentLeaseTemplate]);

  return (
    <>
      {isLoading || !currentLeaseAgreement ? (
        <UIProgressPrompt
          title="Hang Tight!"
          message="Please wait while we load the lease renewal request."
        />
      ) : (
        <>
          <ProgressModal
            open={isSubmitting}
            title="Accpeting Lease Renewal Request..."
          />
          <AlertModal
            title={alertModalTitle}
            message={alertModalMessage}
            open={showAlertModal}
            btnText="Okay"
            onClick={() => {
              if (
                isCurrentLeaseTemplateTermDifferent(
                  currentLeaseTemplate,
                  leaseRenewalRequest
                )
              ) {
                setViewMode("change_terms");
                setShowAlertModal(false);
              } else {
                setShowAlertModal(false);
                navigate("/dashboard/landlord/lease-renewal-requests/");
              }
            }}
          />
          <ConfirmModal
            open={openAcceptModal}
            onClick={() => setOpenAcceptModal(false)}
            title="Accept Lease Renewal Request"
            message="Are you sure you want to accept this lease renewal request? The tenant will be notified."
            btnText="Accept"
            handleConfirm={handleAccept}
            handleCancel={() => setOpenAcceptModal(false)}
            cancelBtnText="Cancel"
            confirmBtnText="Accept"
          />
          {viewMode === "review" && (
            <div>
              <h5 className="my-2">
                {leaseRenewalRequest.tenant.user.first_name}{" "}
                {leaseRenewalRequest.tenant.user.last_name} - Review Lease Renewal
                Request
              </h5>
              {currentLeaseAgreement && (
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Rental Property</h6>
                          {leaseRenewalRequest.rental_unit.rental_property_name}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Rental Unit </h6>
                          {leaseRenewalRequest.rental_unit.name}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Rent</h6>${currentLeaseTemplate.rent}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>New Term Requested</h6>
                          {leaseRenewalRequest.request_term} Months
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Late Fee</h6>
                          {`$${currentLeaseTemplate.late_fee}`}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Security Deposit</h6>
                          {`$${currentLeaseTemplate.security_deposit}`}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Gas Included?</h6>
                          {`${
                            currentLeaseTemplate.gas_included ? "Yes" : "No"
                          }`}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Electric Included?</h6>
                          {`${
                            currentLeaseTemplate.electric_included
                              ? "Yes"
                              : "No"
                          }`}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Water Included?</h6>
                          {`${
                            currentLeaseTemplate.water_included ? "Yes" : "No"
                          }`}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Lease Cancellation Fee</h6>
                          {`$${currentLeaseTemplate.lease_cancellation_fee}`}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Lease Cancellation Notice period</h6>
                          {`${currentLeaseTemplate.lease_cancellation_notice_period} Month(s)`}
                        </div>
                        <div className="col-md-4 mb-4 text-black">
                          <h6>Grace period</h6>
                          {currentLeaseTemplate.grace_period === 0 ? (
                            "None"
                          ) : (
                            <>{`${currentLeaseTemplate.grace_period} Month(s)`}</>
                          )}
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              )}
              <Stack
                sx={{ marginTop: "1rem" }}
                direction="row"
                spacing={2}
                alignContent={"center"}
                justifyContent={"space-between"}
              >
                <Stack direction="row" spacing={2}>
                  <UIButton
                    style={{
                      textTransform: "none",
                      backgroundColor: uiRed,
                      color: "white",
                      marginTop: "1rem",
                    }}
                    onClick={() => navigate(-1)}
                    btnText={"Back"}
                  />
                  <UIButton
                    style={{
                      textTransform: "none",
                      background: uiGreen,
                      color: "white",
                      marginTop: "1rem",
                    }}
                    onClick={() => setViewMode("submit_confirmation")}
                    btnText={"Accept"}
                  />
                </Stack>
              </Stack>
            </div>
          )}
          {viewMode === "change_terms" && (
            <div>
              <h5 className="my-2"></h5>
              <CreateLeaseTemplate
                isLeaseRenewal={true}
                setSelectedLeaseTemplate={setSelectedLeaseTemplate}
                hideBackButton={true}
                leaseRenewalRequest={leaseRenewalRequest}
                currentLeaseAgreement={currentLeaseAgreement}
                customTitle={` ${leaseRenewalRequest.tenant.user.first_name}
                ${leaseRenewalRequest.tenant.user.last_name} - Change Lease Terms`}
                currentTemplateId={currentTemplateId}
                setCurrentTemplateId={setCurrentTemplateId}
                documentMode={documentMode}
                setDocumentMode={setDocumentMode}
                viewMode={viewMode}
                setViewMode={setViewMode}
                currentLeaseTemplate={currentLeaseTemplate}
                setCurrentLeaseTemplate={setCurrentLeaseTemplate}
              />
            </div>
          )}
          {viewMode === "submit_confirmation" && (
            <div>
              <UIPrompt
                title="Are you sure?"
                message="Are you sure you want to accept this lease renewal request?"
                body={
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent={"space-between"}
                  >
                    <UIButton
                      style={{
                        textTransform: "none",
                        backgroundColor: uiRed,
                        color: "white",
                        marginTop: "1rem",
                      }}
                      onClick={() => setViewMode("review")}
                      btnText={"No"}
                    />
                    <UIButton
                      style={{
                        textTransform: "none",
                        background: uiGreen,
                        color: "white",
                        marginTop: "1rem",
                      }}
                      onClick={() => setOpenAcceptModal(true)}
                      btnText={"Yes"}
                    />
                  </Stack>
                }
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LeaseRenewalAcceptForm;
