import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { uiGreen, uiRed } from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import { Stack } from "@mui/material";
import UITableMini from "../../UIComponents/UITable/UITableMini";
import {
  approveLeaseRenewalRequest,
  getLeaseRenewalRequestById,
  rejectLeaseRenewalRequest,
} from "../../../../api/lease_renewal_requests";
import {
  getNextPaymentDate,
  getPaymentDates,
} from "../../../../api/manage_subscriptions";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import { getLeaseAgreementsByTenant } from "../../../../api/lease_agreements";
import UITable from "../../UIComponents/UITable/UITable";
import BackButton from "../../UIComponents/BackButton";

const LeaseRenewalRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaseRenewalRequest, setLeaseRenewalRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [nextPaymentDate, setNextPaymentDate] = useState(null); //TODO: get next payment date from db and set here
  const [dueDates, setDueDates] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [currentLeaseAgreement, setCurrentLeaseAgreement] = useState(null); //TODO: get current lease agreement from db and set here
  const [currentLeaseTemplate, setCurrentLeaseTemplate] = useState(null); //TODO: get current lease template from db and set here
  const [openAcceptModal, setOpenAcceptModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const columns = [
    { name: "amount", label: "Amount" },
    { name: "due_date", label: "Due Date" },
    { name: "status", label: "Status" },
  ];

  const handleReject = () => {
    rejectLeaseRenewalRequest({
      lease_renewal_request_id: leaseRenewalRequest.id,
    }).then((res) => {
      console.log(res);
      if (res.status === 204) {
        setAlertModalTitle("Success");
        setAlertModalMessage("Lease renewal request rejected!");
        setShowAlertModal(true);
      } else {
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong!");
        setShowAlertModal(true);
      }
    });
  };

  const actionStack = (
    <Stack
      direction="row"
      gap={2}
      justifyContent={"end"}
      sx={{ margin: "30px 0" }}
    >
      <UIButton
        onClick={setOpenRejectModal}
        variant="contained"
        style={{ backgroundColor: uiRed }}
        btnText="Reject"
      />
      <UIButton
        onClick={() =>
          navigate("/dashboard/landlord/lease-renewal-accept-form/" + id)
        }
        variant="contained"
        style={{ background: uiGreen }}
        btnText="Reveiw & Accept"
      />
    </Stack>
  );
  useEffect(() => {
    setIsLoading(true);
    getLeaseRenewalRequestById(id)
      .then((lease_renewal_res) => {
        if (lease_renewal_res.status === 200) {
          setLeaseRenewalRequest(lease_renewal_res.data);
          if (!currentLeaseAgreement || !currentLeaseTemplate) {
            getLeaseAgreementsByTenant(lease_renewal_res.data.tenant.id).then(
              (res) => {
                console.log("Tenant's Lease agreements ", res);
                const lease_agreements = res.data;
                const current_lease_agreement = lease_agreements.find(
                  (lease_agreement) => lease_agreement.is_active === true
                );
                setCurrentLeaseAgreement(current_lease_agreement);
                setCurrentLeaseTemplate(current_lease_agreement.lease_template);
                console.log("Current Lease Agreement", current_lease_agreement);
                getNextPaymentDate(lease_renewal_res.data.tenant.id).then(
                  (res) => {
                    setNextPaymentDate(
                      new Date(res.data.next_payment_date).toLocaleDateString()
                    );
                  }
                );
                getPaymentDates(lease_renewal_res.data.tenant.id).then(
                  (res) => {
                    if (res.status === 200) {
                      const payment_dates = res.data.payment_dates;
                      const due_dates = payment_dates.map((date) => {
                        return {
                          amount: current_lease_agreement.lease_template.rent,
                          title: "Rent Due",
                          due_date: new Date(
                            date.payment_date
                          ).toLocaleDateString(),
                          status: date.transaction_paid ? "Paid" : "Unpaid",
                        };
                      });
                      setDueDates(due_dates);
                    }
                  }
                );
              }
            );
          }
        } else {
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong!");
          setShowAlertModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong. Please try again later.");
        setShowAlertModal(true);
      })
      .finally(() => setIsLoading(false));
  }, [currentLeaseAgreement]);

  return (
    <div className="container-fluid">
      <BackButton to="/dashboard/landlord/lease-renewal-requests/" />
      <AlertModal
        open={showAlertModal}
        onClick={() => navigate("/dashboard/landlord/lease-renewal-requests/")}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText="Okay"
      />

      <ConfirmModal
        open={openRejectModal}
        onClick={() => setOpenRejectModal(false)}
        title="Reject Lease Renewal Request"
        message="Are you sure you want to reject this lease renewal request? The tenant will be notified."
        btnText="Reject"
        handleConfirm={handleReject}
        handleCancel={() => setOpenRejectModal(false)}
        cancelBtnText="Cancel"
        confirmBtnText="Reject"
      />
      {isLoading ? (
        <UIProgressPrompt
          title="Hang tight!"
          message="Please wait while we load the lease renewal request details..."
        />
      ) : (
        <>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <h4>
              {" "}
              {leaseRenewalRequest.tenant.first_name}{" "}
              {leaseRenewalRequest.tenant.last_name}'s Lease Renewal Request (
              {leaseRenewalRequest.status})
            </h4>
            {actionStack}
          </Stack>

          <div className="row">
            {currentLeaseAgreement && (
              <div className="col-md-6 align-self-center">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h5 className="mb-3">Current Lease Agreement Details</h5>
                      <div className="col-sm-12 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Current Unit
                        </h6>
                        {currentLeaseAgreement.rental_unit.name}
                      </div>{" "}
                      <div className="col-sm-12 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Curent Term
                        </h6>
                        {currentLeaseTemplate.term} Months
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Property
                        </h6>
                        {currentLeaseAgreement.rental_unit.rental_property_name}
                      </div>{" "}
                      <div className="col-sm-12 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Rent
                        </h6>
                        ${currentLeaseTemplate.rent}
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Lease Start Date
                        </h6>
                        {new Date(
                          currentLeaseAgreement.start_date
                        ).toLocaleDateString()}
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Lease End Date
                        </h6>
                        {new Date(
                          currentLeaseAgreement.end_date
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-6 align-self-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <h5 className="mb-3">Lease Renewal Request Details</h5>{" "}
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Requested Unit
                      </h6>
                      {leaseRenewalRequest.rental_unit.name}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Requested Lease Term
                      </h6>
                      {leaseRenewalRequest.request_term} months
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Desired Move In Date
                      </h6>
                      {new Date(
                        leaseRenewalRequest.move_in_date
                      ).toLocaleDateString()}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Date Submitted
                      </h6>
                      {new Date(
                        leaseRenewalRequest.request_date
                      ).toLocaleDateString()}
                    </div>
                    <div className="col-sm-12 col-md-12 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Additional Comments
                      </h6>
                      {leaseRenewalRequest.comments}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <UITable
                title="Rent Payments"
                data={dueDates}
                columns={columns}
                options={{
                  isSelectable: false,
                  onRowClick: null,
                }}
              />
            </div>
          </div>

          {actionStack}
        </>
      )}
    </div>
  );
};

export default LeaseRenewalRequestDetail;
