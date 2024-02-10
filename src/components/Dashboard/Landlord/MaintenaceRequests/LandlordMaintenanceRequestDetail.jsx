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
import { Button } from "@mui/material";
import { uiGreen, uiRed } from "../../../../constants";
import { useForm } from "react-hook-form";
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
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleChangeStatus = (data) => {
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
    changeMaintenanceRequestStatus(id, payload).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setConfirmMessage("Maintenance Request status has been changed");
        setShowAlertModal(true);
        setStatus(status);
        // navigate(0);
      }
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
      <BackButton to={`/dashboard/landlord/maintenance-requests`} />
      {isLoading ? (
        <ProgressModal />
      ) : (
        <div>
          <AlertModal
            open={showAlertModal}
            handleClose={() => setShowAlertModal(false)}
            onClick={() => setShowAlertModal(false)}
            title="Maintenance Request"
            message={confirmMessage}
            btnText="Okay"
          />
          <div className="row">
            <div className="col-md-4">
              <div className="mb-4">
                <h5>Change Status</h5>
                <form onSubmit={handleSubmit(handleChangeStatus)}>
                  <select
                    {...register("status", { required: true })}
                    className="form-select"
                    style={{ background: "white" }}
                  >
                    <option value={maintenanceRequest.status}>
                      Select One
                    </option>
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
              <div className="row">
                <div className="col-6 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <HomeIcon style={{ fontSize: "25pt", color: uiGreen }} />
                      <h5 className="mb-1">Type</h5>
                      <p className="text-black">{maintenanceRequest.type}</p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <MeetingRoomIcon
                        style={{ fontSize: "25pt", color: uiGreen }}
                      />
                      <h5 className="mb-1">Status</h5>
                      <p>
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
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <HomeIcon style={{ fontSize: "25pt", color: uiGreen }} />
                      <h5 className="mb-1">Property</h5>
                      <p className="text-black">{property.name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <MeetingRoomIcon
                        style={{ fontSize: "25pt", color: uiGreen }}
                      />
                      <h5 className="mb-1">Unit</h5>
                      <p className="text-black">{unit.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h6>
                        <strong>Issue</strong>
                      </h6>
                      <p className="text-black">
                        {maintenanceRequest.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                      <FastfoodIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Typography
                      sx={{ color: "black" }}
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
                      9:30 am
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot sx={{ background: uiGreen }}>
                      <LaptopMacIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Typography
                      sx={{ color: "black" }}
                      variant="h6"
                      component="span"
                    >
                      Work Order Created
                    </Typography>
                    <Typography sx={{ color: "black" }}>
                      A work order has been created for your maintenance request
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineOppositeContent sx={{ flex: 0.1 }}>
                    <Typography variant="body2" color="text.secondary">
                      9:30 am
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot
                      sx={{ background: uiGreen }}
                      variant="outlined"
                    >
                      <HotelIcon />
                    </TimelineDot>
                    <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Typography
                      sx={{ color: "black" }}
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
                      9:30 am
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
                    <TimelineDot sx={{ background: uiGreen }}>
                      <RepeatIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Typography
                      sx={{ color: "black" }}
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
              <Button
                onClick={() => {
                  setShowDeleteConfirm(true);
                }}
                variant="contained"
                sx={{
                  background: uiRed,
                  textTransform: "none",
                  marginLeft: "10px",
                  float: "right",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Delete Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMaintenanceRequestDetail;
