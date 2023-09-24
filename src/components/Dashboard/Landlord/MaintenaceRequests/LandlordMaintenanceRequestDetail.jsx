import React, { useEffect, useState } from "react";
import {
  changeMaintenanceRequestStatus,
  deleteMaintenanceRequest,
  getMaintenanceRequestById,
  getProperty,
  getUnit,
  markMaintenanceRequestAsResolved,
  markMaintenanceRequestAsUnresolved,
} from "../../../../api/api";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { useNavigate, useParams } from "react-router";
import UIButton from "../../UIComponents/UIButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import BackButton from "../../UIComponents/BackButton";
import { Alert, Button } from "@mui/material";
import { uiGreen, uiRed } from "../../../../constants";
import { set, useForm } from "react-hook-form";

const LandlordMaintenanceRequestDetail = () => {
  const { id } = useParams();
  const [maintenanceRequest, setMaintenanceRequest] = useState({});
  const [property, setProperty] = useState({});
  const [unit, setUnit] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [openSetResolveModal, setOpenSetResolveModal] = useState(false);
  const [openSetUnresolveModal, setOpenSetUnresolveModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showDeleteErrorMessage, setShowDeleteErrorMessage] = useState(false);
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
        navigate(0);
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
        setConfirmMessage("Maintenance Request has been deleted. You will be redirected to the maintenance requests page.");
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
        setIsLoading(false);
        //Retrieve property by id
        getProperty(res.data.rental_property).then((property_res) => {
          setProperty(property_res);
        });
        //Retrieve unit by id
        getUnit(res.data.rental_unit).then((unit_res) => {
          setUnit(unit_res);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //TODO: Add component that allows user to search for service providers

  return (
    <div>
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
              <h4 className="mb-3">Property Information</h4>
              <div className="card">
                <div className="card-body">
                  <h6>
                    <strong>Property Name</strong>
                  </h6>
                  <p>{property.name}</p>
                  <h6>
                    <strong>Address</strong>
                  </h6>
                  <p>
                    {property.street}, {property.city} {property.state}{" "}
                    {property.zip_code}
                  </p>
                  <h6>
                    <strong>Unit</strong>
                  </h6>
                  <p>{unit.name}</p>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <h4 className="mb-3">Maintenance Request Information</h4>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h6>
                        <strong>Issue</strong>
                      </h6>
                      <p>{maintenanceRequest.description}</p>
                    </div>
                    <div className="col-md-4">
                      <h6>
                        <strong>Type</strong>
                      </h6>
                      <p style={{ textTransform: "capitalize" }}>
                        {maintenanceRequest.type}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h6>
                        <strong>Status</strong>
                      </h6>
                      <p>
                        {maintenanceRequest.status === "pending" && (
                          <span className="text-warning">Pending</span>
                        )}
                        {maintenanceRequest.status === "in_progress" && (
                          <span className="text-info">In Progress</span>
                        )}
                        {maintenanceRequest.status === "completed" && (
                          <span className="text-success">Completed</span>
                        )}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h6>
                        <strong>Change Status</strong>
                      </h6>
                      <p style={{ textTransform: "capitalize" }}>
                        <form onSubmit={handleSubmit(handleChangeStatus)}>
                          <select
                            {...register("status", { required: true })}
                            className="form-select"
                          >
                            <option value={maintenanceRequest.status}>
                              Select One
                            </option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          {errors.status && (
                            <p className="text-danger">
                              Please select a status
                            </p>
                          )}
                          <UIButton
                            type="submit"
                            className="btn btn-primary mt-3"
                            btnText="Change Status"
                            style={{ marginTop: "15px", width: "100%" }}
                          />
                        </form>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
