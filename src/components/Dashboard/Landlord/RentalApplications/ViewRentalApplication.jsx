import React, { useState, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { authUser, uiGreen, uiRed } from "../../../../constants";
import { useParams } from "react-router";
import { createLeaseAgreement } from "../../../../api/lease_agreements";
import {
  approveRentalApplication,
  deleteOtherRentalApplications,
  getRentalApplicationById,
  rejectRentalApplication,
} from "../../../../api/rental_applications";
import { getUnit } from "../../../../api/units";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { sendDocumentToUser } from "../../../../api/boldsign";
import { authenticatedInstance } from "../../../../api/api";
import UITabs from "../../UIComponents/UITabs";
import UIButton from "../../UIComponents/UIButton";
import BackButton from "../../UIComponents/BackButton";
import useScreen from "../../../../hooks/useScreen";

const ViewRentalApplication = () => {
  const { id } = useParams();
  const { isMobile } = useScreen();
  const [unit, setUnit] = useState(null);
  const [rentalApplication, setRentalApplication] = useState({});
  const [employmentHistory, setEmploymentHistory] = useState({});
  const [residentialHistory, setResidentialHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApplicationAction, setIsLoadingApplicationAction] =
    useState(false);
  const [openAcceptModal, setOpenAcceptModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [aletModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [tabPage, setTabPage] = useState(0);
  const tabs = [
    { label: "Details", name: "details" },
    { label: "Employment History", name: "employment_history" },
    { label: "Residential History", name: "residential_history" },
  ];

  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };

  const handleAccept = async () => {
    setIsLoadingApplicationAction(true);
    console.log("Accepting Application...");
    console.log("unt", unit);
    //Check if unit has a template
    if (!unit.template_id && !unit.signed_lease_document_file) {
      setAlertModalTitle("An error occurred");
      setAlertModalMessage(
        "This unit does not have a lease agreement document or template document. Please upload a lease agreement template for this unit and try again."
      );
      setOpenAlertModal(true);
      return false;
    }

    try {
      // Approve and Archive this application
      const approvalResponse = await approveRentalApplication(id);
      console.log(approvalResponse);

      if (approvalResponse.status === 200) {
        setOpenAcceptModal(false);
        setAlertModalTitle("Rental Application Approved");
        setAlertModalMessage(
          "The Rental Application has been approved. The lease agreement has been sent to the applicant."
        );
        setOpenAlertModal(true);
      } else {
        console.log(approvalResponse);
        setAlertModalTitle("An error occurred");
        setOpenAlertModal(true);
      }
    } catch (error) {
      console.log(error);
      setAlertModalTitle("An error occurred");
      setOpenAlertModal(true);
    } finally {
      setIsLoadingApplicationAction(false);
      setOpenAlertModal(true);
    }
  };

  //create a function to reject the appplciation
  const handleReject = () => {
    setIsLoadingApplicationAction(true);
    console.log("Rejecting Application...");
    rejectRentalApplication(id).then((res) => {
      if (res.status === 200) {
        console.log(res);
        setOpenRejectModal(false);
        //TODO: Delete this application
        setAlertModalTitle(res.message);
        setOpenAlertModal(true);
        setIsLoadingApplicationAction(false);
      } else {
        console.log(res);
        setAlertModalTitle("An error occured");
        setOpenAlertModal(true);
        setIsLoadingApplicationAction(false);
      }
    });
  };
  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    setIsLoading(true);
    //Retrieve rental application by id
    getRentalApplicationById(id).then((res) => {
      //WARNING THIS API CALL REQUIRES A TOKEN AND WILL NOT WORK FOR USERS NOT LOGGED IN
      if (res) {
        setRentalApplication(res);
        setUnit(res.unit);
        //Check if res.employment_history is an oject if so parse it if string leave it
        if (isJsonString(res.employment_history)) {
          setEmploymentHistory(JSON.parse(res.employment_history));
        } else {
          setEmploymentHistory(res.employment_history);
        }
        //Check if res.residential_history is an oject if so parse it if string leave it
        if (isJsonString(res.residential_history)) {
          setResidentialHistory(JSON.parse(res.residential_history));
        } else {
          setResidentialHistory(res.residential_history);
        }
        setIsLoading(false);
      }
    });
  }, []);
  return (
    <div className="container-fluid">
      <BackButton to={`/dashboard/landlord/rental-applications`} />
      <ProgressModal
        title="Processing Application..."
        open={isLoadingApplicationAction}
      />
      {isLoading ? (
        <ProgressModal title="Loading Application Data..." open={isLoading} />
      ) : (
        <div>
          <AlertModal
            open={openAlertModal}
            title={aletModalTitle}
            message={alertModalMessage}
            btnText="Ok"
            handleClose={() => setOpenAlertModal(false)}
            to="/dashboard/landlord/rental-applications"
          />
          <ConfirmModal
            open={openAcceptModal}
            title={"Are you sure you want to accept this application?"}
            message={
              "Accepting this application will will send a lease agreement to the applicant and this application will be archived. The remaining applications will be deleted. Do you wish to continue?"
            }
            cancelBtnText="Cancel"
            confirmBtnText="Confirm"
            handleClose={() => setOpenAcceptModal(false)}
            handleConfirm={handleAccept}
            handleCancel={() => setOpenAcceptModal(false)}
          />
          <ConfirmModal
            open={openRejectModal}
            title={"Are you sure you want to reject this application?"}
            message={
              "Rejecting this application will permenantly delete it fdorm your records. Do you wish to continue?"
            }
            cancelBtnText="Cancel"
            confirmBtnText="Confirm"
            handleClose={() => setOpenRejectModal(false)}
            handleConfirm={handleReject}
            handleCancel={() => setOpenRejectModal(false)}
            cancelBtnStyle={{ background: uiGreen }}
            confirmBtnStyle={{ background: uiRed }}
          />
          <div className="mb-3" style={{ overflow: "auto" }}>
            <h4 style={{ float: "left", fontSize: isMobile ? "14pt" : "20pt" }}>
              {" "}
              {rentalApplication.first_name} {rentalApplication.last_name}{" "}
              Rental Application (Status :{" "}
              {rentalApplication.is_approved ? "Approved" : "Pending"}){" "}
              {rentalApplication.is_archived ? "(Archived)" : ""}
            </h4>
            <Button
              variant="contained"
              sx={{ background: uiGreen, float: "right" }}
            >
              View Full Report
            </Button>
          </div>
          <UITabs
            value={tabPage}
            handleChange={handleChangeTabPage}
            tabs={tabs}
            variant="fullWidth"
            scrollButtons="auto"
            ariaLabel=""
            style={{ marginBottom: "20px" }}
          />
          {tabPage === 0 && (
            <>
              <div className="mb-4">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6>
                          <b>Full Name</b>
                        </h6>
                        <p className="text-black">
                          {rentalApplication.first_name}{" "}
                          {rentalApplication.last_name}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Email</b>
                        </h6>
                        <p className="text-black">{rentalApplication.email}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Date Of Birth</b>
                        </h6>
                        <p className="text-black">
                          {new Date(
                            rentalApplication.date_of_birth
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Phone</b>
                        </h6>
                        <p className="text-black">
                          {rentalApplication.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6>
                          <b>Other Occupants</b>
                        </h6>
                        <p className="text-black">
                          {rentalApplication.other_occupants ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Pets</b>
                        </h6>
                        <p className="text-black">
                          {rentalApplication.pets ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Do you have any vehicles?</b>
                        </h6>
                        <p className="text-black">
                          {rentalApplication.vehicles ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Ever Convicted?</b>
                        </h6>
                        <p className="text-black">
                          {rentalApplication.conviceted ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Ever Filed for bankrupcy?</b>
                        </h6>
                        <p className="text-black">
                          {rentalApplication.bankrupcy_filed ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Ever evicted?</b>
                        </h6>
                        <p className="text-black">
                          {rentalApplication.evicted ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="card">
                  <div className="card-body text-black">
                    {rentalApplication.comments}
                  </div>
                </div>
              </div>
            </>
          )}

          {tabPage === 1 && (
            <div className="mb-4">
              <div className="card">
                <div className="card-body">
                  {employmentHistory.map((item, index) => {
                    return (
                      <div className="row mb-3">
                        <h5 className="mb-3">
                          <b>
                            {item.companyName} (
                            {new Date(
                              item.employmentStartDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              item.employmentEndDate
                            ).toLocaleDateString()}
                            )
                          </b>
                        </h5>
                        <div className="col-md-6">
                          <h6>
                            <b>Company Address</b>
                          </h6>
                          <p className="text-black">{item.companyAddress}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            <b>Position</b>
                          </h6>
                          <p className="text-black">{item.position}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            <b>Income</b>
                          </h6>
                          <p className="text-black">
                            ${Intl.NumberFormat("en-US").format(item.income)}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            <b>Supervisor</b>
                          </h6>
                          <p className="text-black">{item.supervisorName}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            <b>Supervisor Email</b>
                          </h6>
                          <p className="text-black">{item.supervisorEmail}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            <b>Supervisor Phone</b>
                          </h6>
                          <p className="text-black">{item.supervisorPhone}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tabPage === 2 && (
            <div className="mb-4">
              <div className="card">
                <div className="card-body">
                  {residentialHistory.map((item, index) => {
                    return (
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <h5>
                            <b>
                              {item.address} (
                              {new Date(
                                item.residenceStartDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                item.residenceEndDate
                              ).toLocaleDateString()}
                              )
                            </b>
                          </h5>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            <b>Landlord Name</b>
                          </h6>
                          <p className="text-black">{item.landlordName}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            <b>Landlord Phone</b>
                          </h6>
                          <p className="text-black">{item.landlordPhone}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>
                            <b>Landlord Email</b>
                          </h6>
                          <p className="text-black">{item.landlordEmail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!rentalApplication.is_approved ? (
            <Stack direction="row" gap={2}>
              <Button
                onClick={setOpenRejectModal}
                variant="contained"
                sx={{ background: "red" }}
              >
                Reject
              </Button>
              <Button
                onClick={setOpenAcceptModal}
                variant="contained"
                sx={{ background: uiGreen }}
              >
                Accept
              </Button>
            </Stack>
          ) : (
            <>
              <UIButton
                btnText={
                  rentalApplication.is_archived ? "Unarchive" : "Archive"
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewRentalApplication;
