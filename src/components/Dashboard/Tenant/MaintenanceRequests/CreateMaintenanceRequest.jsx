import React, { useEffect, useState } from "react";
import { createMaintenanceRequest } from "../../../../api/maintenance_requests";
import { getTenantDashboardData } from "../../../../api/tenants";
import {
  authUser,
  uiGreen,
  validationMessageStyle,
} from "../../../../constants";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { useForm } from "react-hook-form";
import UIPrompt from "../../UIComponents/UIPrompt";
import DescriptionIcon from "@mui/icons-material/Description";

const CreateMaintenanceRequest = () => {
  const [unit, setUnit] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    //Retrieve the unit
    getTenantDashboardData().then((res) => {
      console.log(res);
      setUnit(res.unit);
      setLeaseAgreement(res.lease_agreement);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Create a function to handle the form submission
  const onSubmit = (data) => {
    setIsLoading(true);

    //Create a data object to send to the backend
    const payload = {
      rental_unit: unit.id,
      rental_property: unit.rental_property,
      description: data.description,
      tenant: authUser.tenant_id,
      type: data.type,
      owner: leaseAgreement.owner.id,
    };
    console.log("Payload", payload);
    createMaintenanceRequest(payload).then((res) => {
      setIsLoading(false);
      console.log(res);
      if (res.status !== 400) {
        setResponseMessage(res.message);
        setShowResponseModal(true);
        console.log(res.message);
      } else {
        setResponseMessage(res.message);
        setShowResponseModal(true);
        console.log(responseMessage);
      }
    });
  };

  return (
    <>
      {leaseAgreement ? (
        <div className="container-fluid">
          <ProgressModal
            open={isLoading}
            handleClose={() => setIsLoading(false)}
            title="Creating Maintenance Request..."
          />
          <AlertModal
            open={showResponseModal}
            handleClose={() => setShowResponseModal(false)}
            title="Maintenance Request"
            message={responseMessage}
            btnText="Okay"
            to="/dashboard/tenant/maintenance-requests"
          />

          <div className="row mb-3">
            <div className="col-sm-12 col-md-8 col-lg-8 offset-sm-0 offset-md-2 offset-lg-2">
              <h3 className="text-black mb-4">Create A Maintenance Request</h3>
              <div className="card shadow mb-5">
                <div className="card-body">
                  <div className="row" />
                  <div className="row" />
                  <div className="row">
                    <div className="col-12">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                          <label className="form-label text-black">Type</label>
                          <div>
                            <select
                              className="form-control"
                              name="type"
                              {...register("type", {
                                required: "This is a required field",
                              })}
                            >
                              <option value="">Select One</option>
                              <option value="plumbing">Plumbing</option>
                              <option value="electrical">Electrical</option>
                              <option value="structural">Structural</option>
                              <option value="appliance">Appliance</option>
                              <option value="other">Other</option>
                            </select>
                            <span style={validationMessageStyle}>
                              {errors.type && errors.type.message}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label
                            className="form-label text-black "
                            htmlFor="signature"
                          >
                            Please Describe Your Issue
                          </label>
                          <textarea
                            {...register("description", {
                              required: "This is a required field",
                            })}
                            className="form-control"
                            id="signature-1"
                            rows={4}
                            name="description"
                            style={{ borderStyle: "none" }}
                            defaultValue={""}
                          />
                          <span style={validationMessageStyle}>
                            {errors.description && errors.description.message}
                          </span>
                        </div>
                        <div className="mb-3">
                          <button
                            className="btn btn-primary btn-sm ui-btn"
                            type="submit"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <UIPrompt
          icon={<DescriptionIcon sx={{ fontSize: 45, color: uiGreen }} />}
          title="No Active Lease Agreement"
          message="You need to have an active lease agreement to create a maintenance requests."
          btnText="Okay"
        />
      )}
    </>
  );
};

export default CreateMaintenanceRequest;
