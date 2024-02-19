import React, { useEffect, useState } from "react";
import {
  changeMaintenanceRequestStatus,
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
import {
  Button,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
} from "@mui/material";
import { uiGreen, uiRed } from "../../../../constants";
import { set, useForm } from "react-hook-form";
import useScreen from "../../../../hooks/useScreen";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import Typography from "@mui/material/Typography";
import ContactVendorModal from "../../UIComponents/Prototypes/Modals/ContactVendorModal";
import DrawIcon from "@mui/icons-material/Draw";
import HandymanIcon from "@mui/icons-material/Handyman";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CachedIcon from "@mui/icons-material/Cached";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UIDialog from "../../UIComponents/Modals/UIDialog";
const LandlordMaintenanceRequestDetail = () => {
  const { id } = useParams();
  const [maintenanceRequest, setMaintenanceRequest] = useState({});
  const [property, setProperty] = useState({});
  const [unit, setUnit] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showDeleteErrorMessage, setShowDeleteErrorMessage] = useState(false);
  const [status, setStatus] = useState(null); //["pending", "in_progress", "completed"]
  const { screenWidth, breakpoints, isMobile } = useScreen();
  const [contantVendorModalOpen, setContactVendorModalOpen] = useState(true);
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
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

  const handleChangeStatus = (data) => {
    setProgressModalOpen(true);
    console.log(data.status);
    const status = data.status;
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
        console.log(res);
        if (res.status === 200) {
          setConfirmMessage("Maintenance Request status has been changed");
          setShowAlertModal(true);
          setStatus(status);
          // navigate(0);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setProgressModalOpen(false);
        setChangeStatusDialogOpen(false);
      });
  };

  const handleDeleteMaintenanceRequest = () => {
    //Check if maintenance request is in progress
    if (maintenanceRequest.status === "in_progress") {
      setShowDeleteErrorMessage(
        "Cannot delete maintenance request that is in progress"
      );
      setShowDeleteError(true);
      setShowDeleteConfirm(false);
      return;
    }
    deleteMaintenanceRequest(id).then((res) => {
      console.log(res);
      if (res.status === 204) {
        setConfirmMessage(
          "Maintenance Request has been deleted. You will be redirected to the maintenance requests page."
        );
        setShowAlertModal(true);
        navigate("/dashboard/landlord/maintenance-requests");
      } else {
        setShowDeleteError(true);
      }
    });
  };

  useEffect(() => {
    getMaintenanceRequestById(id)
      .then((res) => {
        setMaintenanceRequest(res.data);
        setStatus(res.data.status);
        setIsLoading(false);
        //Retrieve property by id
        getProperty(res.data.rental_property.id).then((property_res) => {
          console.log(property_res);
          setProperty(property_res.data);
        });
        //Retrieve unit by id
        getUnit(res.data.rental_unit.id).then((unit_res) => {
          setUnit(unit_res);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //TODO: Add component that allows user to search for service providers

  return (
    <div className="container-fluid">
      {isLoading ? (
        <UIProgressPrompt
          title="Loading Maintenance Request"
          message="Please wait while we load the maintenance request"
        />
      ) : (
        <div>
          <ProgressModal open={progressModalOpen} title={"Loading..."} />
          <AlertModal
            open={showAlertModal}
            handleClose={() => setShowAlertModal(false)}
            onClick={() => setShowAlertModal(false)}
            title="Maintenance Request"
            message={confirmMessage}
            btnText="Okay"
          />
          <ContactVendorModal
            open={contantVendorModalOpen}
            onClose={() => setContactVendorModalOpen(false)}
            issue={maintenanceRequest.description}
          />
          <AlertModal
            open={showDeleteError}
            handleClose={() => setShowDeleteError(false)}
            onClick={() => setShowDeleteError(false)}
            title="Error"
            message={showDeleteErrorMessage}
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
          <UIDialog
            id="changeStatusDialog"
            title="Change Status"
            open={changeStatusDialogOpen}
            onClose={() => setChangeStatusDialogOpen(false)}
            style={{ width: "500px" }}
          >
            <div className="mb-4">
              <form onSubmit={handleSubmit(handleChangeStatus)}>
                <select
                  {...register("status", { required: true })}
                  className="form-select card"
                  style={{ background: "white" }}
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
                  type="submit"
                  className="btn btn-primary mt-3"
                  btnText="Change Status"
                  style={{ marginTop: "15px", width: "100%" }}
                />
              </form>
            </div>
          </UIDialog>
          <BackButton to={`/dashboard/landlord/maintenance-requests`} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <div className="">
              <h4>
                {maintenanceRequest?.tenant.user.first_name +
                  " " +
                  maintenanceRequest?.tenant.user.last_name}
              </h4>
              <span className="text-black">
                Unit {unit?.name} @ {property?.name}
              </span>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                alignContent={"center"}
              >
                <p style={{ margin: "0" }}>
                  <span className="text-black">Status: </span>
                  {status === "pending" && (
                    <span className="text-warning">Pending</span>
                  )}
                  {status === "in_progress" && (
                    <span className="text-info">In Progress</span>
                  )}
                  {status === "completed" && (
                    <span className="text-success">Completed</span>
                  )}
                </p>
              </Stack>
            </div>
            <div>
              <IconButton
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <MoreVertIcon />
              </IconButton>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 10 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom-start"
                          ? "right top"
                          : "right top",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem
                            onClick={() => {
                              setChangeStatusDialogOpen(true);
                            }}
                          >
                            Change Status
                          </MenuItem>
                          <MenuItem
                            onClick={() => setContactVendorModalOpen(true)}
                          >
                            Contact Vendor
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setShowDeleteConfirm(true);
                            }}
                          >
                            Delete Maintenance Request
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </Stack>

          <div className="row">
            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="mb-2 card-title text-black">
                    Message from tenant
                  </h5>
                  <div className="row">
                    <div className="col-md-12">
                      <p className="text-black">
                        {maintenanceRequest.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-2 card-title text-black">Event Timeline</h5>
                  <Timeline align="left">
                    <TimelineItem>
                      <TimelineOppositeContent sx={{ flex: 0.1 }}>
                        <Typography variant="body2" color="text.secondary">
                          9:30 am
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ background: uiGreen }}>
                          <PostAddIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          sx={{ color: "black", fontSize: "14pt" }}
                          variant="h6"
                          component="span"
                        >
                          Maintenance Request Created
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          Your tenant has submitted a maintenance request
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent sx={{ flex: 0.1 }}>
                        <Typography variant="body2" color="text.secondary">
                          10:30 am
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ background: uiGreen }}>
                          <ReceiptIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          sx={{ color: "black", fontSize: "14pt" }}
                          variant="h6"
                          component="span"
                        >
                          Work Order Created
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          A work order has been created for your maintenance
                          request
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent sx={{ flex: 0.1 }}>
                        <Typography variant="body2" color="text.secondary">
                          11:30 am
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot
                          sx={{ background: uiGreen }}
                          variant="outlined"
                        >
                          <HandymanIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          sx={{ color: "black", fontSize: "14pt" }}
                          variant="h6"
                          component="span"
                        >
                          Vendor Assigned
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          A vendor has been assigned to your work order
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent sx={{ flex: 0.1 }}>
                        <Typography variant="body2" color="text.secondary">
                          2:00 pm
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ background: uiGreen }}>
                          <CachedIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Typography
                          sx={{ color: "black", fontSize: "14pt" }}
                          variant="h6"
                          component="span"
                        >
                          Work Order In Progress
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          The vendor is working on your work order
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMaintenanceRequestDetail;
