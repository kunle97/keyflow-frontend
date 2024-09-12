import React, { useEffect, useState, useRef } from "react";
import {
  changeMaintenanceRequestStatus,
  changeMaintenanceRequestPriority,
  deleteMaintenanceRequest,
  getMaintenanceRequestById,
} from "../../../../api/maintenance_requests";
import { getProperty } from "../../../../api/properties";
import { getUnit } from "../../../../api/units";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { useNavigate, useParams } from "react-router";
import UIButton from "../../UIComponents/UIButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import BackButton from "../../UIComponents/BackButton";
import { Chip, Stack } from "@mui/material";
import { authUser, uiGreen, uiRed } from "../../../../constants";
import { set, useForm } from "react-hook-form";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import ConstructionIcon from "@mui/icons-material/Construction";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIPrompt from "../../UIComponents/UIPrompt";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import UIPageHeader from "../../UIComponents/UIPageHeader";
const OwnerMaintenanceRequestDetail = () => {
  const { id } = useParams();
  const [maintenanceRequest, setMaintenanceRequest] = useState({});
  const [billingEntryConfirmModalOpen, setBillingEntryConfirmModalOpen] =
    useState(false);
  const [events, setEvents] = useState([]);
  const [property, setProperty] = useState({});
  const [unit, setUnit] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [status, setStatus] = useState(null); //["pending", "in_progress", "completed"]
  const [priority, setPriority] = useState(null); //["1", "2", "3", "4", "5"]
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [changePriorityDialogOpen, setChangePriorityDialogOpen] =
    useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertRedirectURL, setAlertRedirectURL] = useState("");
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".maintenance-request-detail-page",
      content: "This is the maintenance request detail page",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".maintenace-request-detail-header",
      content:
        "This is the maintenance request detail page header. Here you will find the tenant's name, the status of the maintenance request, and the priority of the maintenance request.",
    },
    {
      target: ".more-button-wrapper",
      content:
        "This button reveals the menu that allows you to change the status, priority, contact the vendor, or delete the maintenance request.",
    },
    {
      target: ".tenant-message-section",
      content:
        "Here you will find the tenant's message about the maintenance request.",
    },
    {
      target: ".maintenance-request-event-section",
      content:
        "Here you will find the maintenance request events. Anytime there is an update with a maintenance request, it will be displayed here.",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
  };

  const anchorRef = useRef(null);

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleChangeStatus = (e) => {
    e.preventDefault();
    setProgressModalOpen(true);
    let is_archived = false;
    if (status === "completed") {
      is_archived = true;
    }
    const payload = {
      status: status,
      is_archived: is_archived,
    };
    changeMaintenanceRequestStatus(id, payload)
      .then((res) => {
        if (res.status === 200) {
          setAlertModalTitle("Status Updated");
          setAlertModalMessage("Maintenance Request status has been changed");
          setShowAlertModal(true);
          setStatus(status);
          if (
            status === "completed" &&
            maintenanceRequest.billing_entry === null
          ) {
            //Create a confirm modal messages asking the user if they want to create a billing entry
            setBillingEntryConfirmModalOpen(true);
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setProgressModalOpen(false);
        setChangeStatusDialogOpen(false);
      });
  };

  const handleChangePriority = (e) => {
    e.preventDefault();
    setProgressModalOpen(true);
    const payload = {
      priority: priority,
    };
    changeMaintenanceRequestPriority(id, payload)
      .then((res) => {
        if (res.status === 200) {
          setAlertModalTitle("Priority Updated");
          setAlertModalMessage("Maintenance Request priority has been changed");
          setShowAlertModal(true);
          setPriority(priority);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setProgressModalOpen(false);
        setChangePriorityDialogOpen(false);
      });
  };

  const handleDeleteMaintenanceRequest = () => {
    //Check if maintenance request is in progress
    if (maintenanceRequest.status === "in_progress") {
      setAlertModalTitle("Error");
      setAlertModalMessage(
        "Cannot delete maintenance request that is in progress"
      );
      setShowAlertModal(true);
      return;
    }
    deleteMaintenanceRequest(id)
      .then((res) => {
        if (res.status === 204) {
          setAlertModalTitle("Maintenance Request Deleted");
          setAlertModalMessage(
            "Maintenance Request has been deleted. You will be redirected to the maintenance requests page."
          );
          setShowAlertModal(true);
          setAlertRedirectURL("/dashboard/owner/maintenance-requests");
        } else {
          setAlertModalTitle("Error");
          setAlertModalMessage("Error deleting maintenance request");
          setShowAlertModal(true);
        }
      })
      .catch((err) => {
        setAlertModalTitle("Error");
        setAlertModalMessage("Error deleting maintenance request");
        setShowAlertModal(true);
      });
  };

  useEffect(() => {
    getMaintenanceRequestById(id)
      .then((res) => {
        setMaintenanceRequest(res.data);
        setStatus(res.data.status);
        setPriority(res.data.priority);
        setEvents(res.data.events);
        setIsLoading(false);
        //Retrieve property by id
        getProperty(res.data.rental_property.id)
          .then((property_res) => {
            setProperty(property_res.data);
          })
          .catch((err) => {
            setAlertModalMessage("Error retrieving property");
            setAlertModalTitle("Error");
            setShowAlertModal(true);
          });
        //Retrieve unit by id
        getUnit(res.data.rental_unit.id)
          .then((unit_res) => {
            setUnit(unit_res);
          })
          .catch((err) => {
            setAlertModalTitle("Error");
            setAlertModalMessage("Error retrieving unit");
            setShowAlertModal(true);
          });
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="container-fluid">
      {isLoading ? (
        <UIProgressPrompt
          title="Loading Maintenance Request"
          message="Please wait while we load the maintenance request"
        />
      ) : (
        <div className="maintenance-request-detail-page">
          <Joyride
            run={runTour}
            index={tourIndex}
            steps={tourSteps}
            callback={handleJoyrideCallback}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            styles={{
              options: {
                primaryColor: uiGreen,
              },
            }}
            locale={{
              back: "Back",
              close: "Close",
              last: "Finish",
              next: "Next",
              skip: "Skip",
            }}
          />
          <ProgressModal open={progressModalOpen} title={"Loading..."} />
          <AlertModal
            open={showAlertModal}
            handleClose={() => setShowAlertModal(false)}
            onClick={() => {
              if(alertRedirectURL){
                navigate(alertRedirectURL);
              }
              setShowAlertModal(false);
            }}
            title={alertModalTitle}
            message={alertModalMessage}
            btnText="Okay"
          />
          <ConfirmModal
            open={showDeleteConfirm}
            title={"Delete Maintenance Request"}
            message={
              "Are you sure you want to delete this maintenance request?"
            }
            cancelBtnText="Cancel"
            confirmBtnText="Confirm"
            cancelBtnStyle={{ background: uiGreen }}
            confirmBtnStyle={{ background: uiRed }}
            handleClose={() => setShowDeleteConfirm(false)}
            handleCancel={() => setShowDeleteConfirm(false)}
            handleConfirm={handleDeleteMaintenanceRequest}
          />
          <ConfirmModal
            title="Create Billing Entry"
            message="Would you like to create a billing entry for this completed maintenance request?"
            open={billingEntryConfirmModalOpen}
            handleClose={() => setBillingEntryConfirmModalOpen(false)}
            handleCancel={() => setBillingEntryConfirmModalOpen(false)}
            handleConfirm={() => {
              setBillingEntryConfirmModalOpen(false);
              navigate(
                `/dashboard/owner/billing-entries/create/maintenance-request/${id}`
              );
            }}
            cancelBtnText="Cancel"
            confirmBtnText="Create Billing Entry"
          />
          <UIDialog
            id="changeStatusDialog"
            title="Change Status"
            open={changeStatusDialogOpen}
            onClose={() => setChangeStatusDialogOpen(false)}
            style={{ width: "500px" }}
          >
            <div className="mb-4">
              <form onSubmit={handleChangeStatus}>
                <select
                  data-testid="status-select"
                  {...register("status", { required: true })}
                  className="form-select card"
                  style={{ background: "white" }}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value={maintenanceRequest.status}>Select One</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="text-danger">Please select a status</p>
                )}
                <UIButton
                  dataTestId="change-status-button"
                  type="submit"
                  className="btn btn-primary mt-3"
                  btnText="Change Status"
                  style={{ marginTop: "15px", width: "100%" }}
                />
              </form>
            </div>
          </UIDialog>
          <UIDialog
            id="changePriorityDialog"
            title="Change Priority"
            open={changePriorityDialogOpen}
            onClose={() => setChangePriorityDialogOpen(false)}
            style={{ width: "500px" }}
          >
            <div className="mb-4">
              <form onSubmit={handleChangePriority}>
                <select
                  data-testid="priority-select"
                  {...register("priority", { required: true })}
                  className="form-select card"
                  style={{ background: "white" }}
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                  }}
                >
                  <option value={maintenanceRequest.priority}>
                    Select One
                  </option>
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                  <option value="4">Urgent</option>
                  <option value="5">Emergency</option>
                </select>
                {errors.priority && (
                  <p className="text-danger">Please select a priority</p>
                )}
                <UIButton
                  dataTestId="change-priority-button"
                  type="submit"
                  className="btn btn-primary mt-3"
                  btnText="Change Priority"
                  style={{ marginTop: "15px", width: "100%" }}
                />
              </form>
            </div>
          </UIDialog>
          <BackButton to={`/dashboard/owner/maintenance-requests`} Pa />
          <UIPageHeader
            style={{ marginBottom: "20px" }}
            title={
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                alignContent={"center"}
                spacing={1}
                sx={{ mt: 1 }}
              >
                <h4 style={{ marginRight: "0px" }}>
                  {maintenanceRequest?.tenant.user.first_name +
                    " " +
                    maintenanceRequest?.tenant.user.last_name}
                </h4>{" "}
                <p style={{ marginRight: "0px" }}>
                  {status === "pending" && (
                    <Chip label="Pending" color="warning" />
                  )}
                  {status === "in_progress" && (
                    <Chip label="In Progress" color="info" />
                  )}
                  {status === "completed" && (
                    <Chip label="Completed" color="success" />
                  )}
                </p>
                <p style={{ marginRight: "0px" }}>
                  {maintenanceRequest.priority === 1 && (
                    <Chip label="Low Priority" color="success" />
                  )}
                  {maintenanceRequest.priority === 2 && (
                    <Chip label="Moderate Priority" color="warning" />
                  )}
                  {maintenanceRequest.priority === 3 && (
                    <Chip label="High Priority" color="error" />
                  )}
                  {maintenanceRequest.priority === 4 && (
                    <Chip label="Urgent Priority" color="error" />
                  )}
                  {maintenanceRequest.priority === 5 && (
                    <Chip label="Emergency Priority" color="error" />
                  )}
                </p>
              </Stack>
            }
            subtitle={`Unit ${unit?.name} @ ${property?.name}`}
            menuItems={
              authUser.account_type === "owner" && [
                {
                  label: "Change Status",
                  action: () => setChangeStatusDialogOpen(true),
                },
                {
                  label: "Change Priority",
                  action: () => setChangePriorityDialogOpen(true),
                },
                {
                  label: "Delete Maintenance Request",
                  action: () => setShowDeleteConfirm(true),
                },
              ]
            }
          />
          <div className="row">
            <div className="col-md-4">
              <div
                className="card mb-3  tenant-message-section"
                data-testid="tenant-message-section"
              >
                <div className="card-body">
                  <h5
                    className="mb-2 card-title text-black"
                    data-testid="tenant-message-title"
                  >
                    Message from tenant
                  </h5>
                  <div className="row">
                    <div className="col-md-12">
                      <p className="text-black" data-testid="tenant-message">
                        {maintenanceRequest.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              {events.length === 0 ? (
                <UIPrompt
                  data-testid="no-events-prompt"
                  icon={
                    <ConstructionIcon
                      sx={{ fontSize: "30pt", color: uiGreen }}
                    />
                  }
                  title="No Events"
                  message="There are no events for this maintenance request. When events occur, they will be displayed here."
                />
              ) : (
                <div className="card maintenance-request-event-section">
                  <div
                    className="card-body"
                    style={{
                      overflowY: "auto",
                      maxHeight: "520px",
                    }}
                  >
                    <h5
                      className="mb-2 card-title text-black"
                      data-testid="event-timeline-title"
                    >
                      Maintenance Request Updates
                    </h5>
                    <Timeline align="left" data-testid="event-timeline">
                      {events.map((event) => (
                        <TimelineItem>
                          <TimelineOppositeContent sx={{ flex: 0.1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(event.created_at).toLocaleDateString()}
                              <br />
                              {new Date(event.created_at).toLocaleTimeString()}
                            </Typography>
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot sx={{ background: uiGreen }}>
                              <ConstructionIcon />
                            </TimelineDot>
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent sx={{ py: "12px", px: 2 }}>
                            <Typography
                              sx={{ color: "black", fontSize: "14pt" }}
                              variant="h6"
                              component="span"
                            >
                              {event.title}
                            </Typography>
                            <Typography sx={{ color: "black" }}>
                              {event.description}
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default OwnerMaintenanceRequestDetail;
