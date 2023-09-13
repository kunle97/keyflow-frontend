import React, { useEffect, useState } from "react";
import {
  getMaintenanceRequestById,
  getProperty,
  getUnit,
  markMaintenanceRequestAsResolved,
  markMaintenanceRequestAsUnresolved,
} from "../../../../api/api";
import ProgressModal from "../../Modals/ProgressModal";
import { useParams } from "react-router";
import UIButton from "../../UIButton";
import AlertModal from "../../Modals/AlertModal";
import ConfirmModal from "../../Modals/ConfirmModal";
import BackButton from "../../BackButton";
import { Button } from "@mui/material";
import { uiRed } from "../../../../constants";

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

  const handleSetResolved = () => {
    markMaintenanceRequestAsResolved(id).then((res) => {
      setIsLoading(true);
      console.log(res);
      if (res.status == 200) {
        setConfirmMessage("Maintenance Request has been marked as resolved");
        setOpenSetResolveModal(false);
        setShowAlertModal(true);
        setIsLoading(false);
      }
    });
  };

  //Create a funtion handleSetUnresolved to  set the maintenance request as unresolved
  const handleSetUnresolved = () => {
    markMaintenanceRequestAsUnresolved(id).then((res) => {
      setIsLoading(true);
      console.log(res);
      if (res.status == 200) {
        setConfirmMessage("Maintenance Request has been marked as unresolved");
        setOpenSetUnresolveModal(false);
        setShowAlertModal(true);
        setIsLoading(false);
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
  }, [maintenanceRequest]);

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
          {/* Create a ConfirmModal that confirms action */}
          <ConfirmModal
            open={openSetResolveModal}
            title={"Set Maintenance Request as Resolved"}
            message={
              "Are you sure you want to set this maintenance request as resolved?"
            }
            cancelBtnText="Cancel"
            conformBtnText="Confirm"
            handleClose={() => setOpenSetResolveModal(false)}
            handleCancel={() => setOpenSetResolveModal(false)}
            handleConfirm={handleSetResolved}
          />
          <ConfirmModal
            open={openSetUnresolveModal}
            title={"Set Maintenance Request as Unresolved"}
            message={
              "Are you sure you want to set this maintenance request as unresolved?"
            }
            cancelBtnText="Cancel"
            conformBtnText="Confirm"
            handleClose={() => setOpenSetUnresolveModal(false)}
            handleCancel={() => setOpenSetUnresolveModal(false)}
            handleConfirm={handleSetUnresolved}
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
                        {maintenanceRequest.is_resolved ? (
                          <span className="text-success">Resolved</span>
                        ) : (
                          <span className="text-danger">Unresolved</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {maintenanceRequest.is_resolved ? (
                // Already Resolved
                <Button
                  onClick={() => {
                    setOpenSetUnresolveModal(true);
                  }}
                  variant="contained"
                  sx={{ background: uiRed, textTransform: "none" }}
                >
                  Set Unresolved
                </Button>
              ) : (
                <UIButton
                  onClick={() => {
                    setOpenSetResolveModal(true);
                  }}
                  btnText="Mark As Resolved"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMaintenanceRequestDetail;
