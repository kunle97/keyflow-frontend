import React, { useState, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { authUser, uiGreen } from "../../../../constants";
import { useParams } from "react-router";
import {
  approveRentalApplication,
  createLeaseAgreement,
  deleteOtherRentalApplications,
  getRentalApplicationById,
  getUnit,
  rejectRentalApplication,
  updateUnit,
} from "../../../../api/api";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const ViewRentalApplication = () => {
  const { id } = useParams();
  const [rentalApplication, setRentalApplication] = useState({});
  const [employmentHistory, setEmploymentHistory] = useState({});
  const [residentialHistory, setResidentialHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openAcceptModal, setOpenAcceptModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [aletModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");

  useEffect(() => {
    //Retrieve rental application by id
    getRentalApplicationById(id).then((res) => {//WARNING THIS API CALL REQUIRES A TOKEN AND WILL NOT WORK FOR USERS NOT LOGGED IN 
      if (res) {
        setRentalApplication(res);
        setEmploymentHistory(JSON.parse(res.employment_history));
        setResidentialHistory(JSON.parse(res.residential_history));
        setIsLoading(false);
      }
    });
  }, []);

  //create a function to accept the appplciation
  const handleAccept = () => {
    console.log("Accepting Application...");
    //Approve and Archive this application
    approveRentalApplication(id).then((res) => {
      setIsLoading(true);
      console.log(res);
      if (res.hasOwnProperty("id")) {
        console.log(res);
        setOpenAcceptModal(false);
        let approval_hash = res.approval_hash;
        console.log("ApprovalHash", approval_hash);
        getUnit(res.unit).then((res) => {
          console.log("unit", res);
          //Retrieve Lease Term from the unit to be stored in lease agreement
          let lease_term = null;
          lease_term = res.lease_term;
          const leaseAgreementData = {
            rental_application: parseInt(id),
            rental_unit: res.id,
            user: authUser.id,
            approval_hash: approval_hash,
            lease_term: lease_term, //TODO: Store lease_terms from Unit in the lease agreement
          };
          console.log("Lease Agreement Data", leaseAgreementData);
          //Create Lease Agreement row in databse that stores the approval_hash
          createLeaseAgreement(leaseAgreementData).then((res) => {
            console.log("Create lease agreement response", res);
            //Generate link & Send lease agreement to applicant
            const signLink =
              "http://localhost:3000/sign-lease-agreement/" +
              res.response.id +
              "/" +
              res.response.approval_hash +
              "/";
            console.log("Sign Link", signLink);
          });


        });

        //Delete all other applications
        deleteOtherRentalApplications(id).then((res) => {
          if (res.status === 200) {
            console.log(res);
          } else {
            console.log(res);
          }
        });
        setAlertModalTitle("Application Approved");
        setOpenAlertModal(true);
      } else {
        console.log(res);
        setAlertModalTitle("An error occured");
        setOpenAlertModal(true);
      }
      setIsLoading(false);
    });
  };

  //create a function to reject the appplciation
  const handleReject = () => {
    console.log("Rejecting Application...");
    rejectRentalApplication(id).then((res) => {
      if (res.status === 200) {
        console.log(res);
        setOpenRejectModal(false);
        //TODO: Delete this application
        setAlertModalTitle(res.message);
        setOpenAlertModal(true);
      } else {
        console.log(res);
        setAlertModalTitle("An error occured");
        setOpenAlertModal(true);
      }
    });
  };

  return (
    <>
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
            conformBtnText="Confirm"
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
            conformBtnText="Confirm"
            handleClose={() => setOpenRejectModal(false)}
            handleConfirm={handleReject}
            handleCancel={() => setOpenRejectModal(false)}
          />
          <div className="mb-3" style={{ overflow: "auto" }}>
            <h4 style={{ float: "left" }}>
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
          <div className="mb-4">
            <h4 className="mb-4">Personal Information</h4>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>
                      <b>Full Name</b>
                    </h6>
                    <p>
                      {rentalApplication.first_name}{" "}
                      {rentalApplication.last_name}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <b>Email</b>
                    </h6>
                    <p>{rentalApplication.email}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <b>Date Of Birth</b>
                    </h6>
                    <p>{rentalApplication.date_of_birth}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <b>Phone</b>
                    </h6>
                    <p>{rentalApplication.phone_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="mb-4">Questionaire Answers</h5>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>
                      <b>Other Occupants</b>
                    </h6>
                    <p>{rentalApplication.other_occupants ? "Yes" : "No"}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <b>Pets</b>
                    </h6>
                    <p>{rentalApplication.pets ? "Yes" : "No"}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <b>Do you have any vehicles?</b>
                    </h6>
                    <p>{rentalApplication.vehicles ? "Yes" : "No"}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <b>Ever Convicted?</b>
                    </h6>
                    <p>{rentalApplication.conviceted ? "Yes" : "No"}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <b>Ever Filed for bankrupcy?</b>
                    </h6>
                    <p>{rentalApplication.bankrupcy_filed ? "Yes" : "No"}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <b>Ever evicted?</b>
                    </h6>
                    <p>{rentalApplication.evicted ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="mb-4">Employment History</h5>
            <div className="card">
              <div className="card-body">
                {employmentHistory.map((item, index) => {
                  return (
                    <div className="row mb-3">
                      <h5 className="mb-3">
                        <b>
                          {item.companyName} ({item.startDate} - {item.endDate})
                        </b>
                      </h5>
                      <div className="col-md-6">
                        <h6>
                          <b>Company Address</b>
                        </h6>
                        <p>{item.companyAddress}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Position</b>
                        </h6>
                        <p>{item.position}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Income</b>
                        </h6>
                        <p>${Intl.NumberFormat("en-US").format(item.income)}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Supervisor</b>
                        </h6>
                        <p>{item.supervisorName}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Supervisor Email</b>
                        </h6>
                        <p>{item.supervisorEmail}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Supervisor Phone</b>
                        </h6>
                        <p>{item.supervisorPhone}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h5 className="mb-4">Residential History</h5>
            <div className="card">
              <div className="card-body">
                {residentialHistory.map((item, index) => {
                  return (
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h5>
                          <b>
                            {item.address} ({item.startDate} - {item.endDate})
                          </b>
                        </h5>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Landlord Name</b>
                        </h6>
                        <p>{item.landlordName}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Landlord Phone</b>
                        </h6>
                        <p>{item.landlordPhone}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <b>Landlord Email</b>
                        </h6>
                        <p>{item.landlordEmail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h5 className="mb-4">Additional Comments</h5>
            <div className="card">
              <div className="card-body">{rentalApplication.comments}</div>
            </div>
          </div>
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
        </div>
      )}
    </>
  );
};

export default ViewRentalApplication;
