import axios from "axios";
import React, { useEffect, useState } from "react";
import { getProperties } from "../../../../api/properties";
import {
  authUser,
  devToolInputStyle,
  uiGreen,
  uiGrey1,
  validationMessageStyle,
} from "../../../../constants";
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIButton from "../../UIComponents/UIButton";
import { getLeaseTemplatesByUser } from "../../../../api/lease_templates";
import { useForm } from "react-hook-form";
import { CardElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
export const TenantGeneratorForm = (props) => {
  const [numberOfItems, setNumberOfItems] = useState(10); // Default value
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [leaseTemplates, setLeaseTemplates] = useState([]);
  const [unitMode, setUnitMode] = useState("");
  const [rentalUnitId, setRentalUnitId] = useState(null);
  const [leaseTemplateMode, setLeaseTemplateMode] = useState("");
  const [leaseTemplateId, setLeaseTemplateId] = useState(null);
  const [createRentalApplication, setCreateRentalApplication] = useState(false);
  const [rentalApplicationIsApproved, setRentalApplicationIsApproved] =
    useState(null);
  const [rentalApplicationIsArchived, setRentalApplicationIsArchived] =
    useState(null);
  const [hasGracePeriod, setHasGracePeriod] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numberOfItems: 10,
      unitMode: "random",
      rentalUnitId: null,
      leaseTemplateMode: "random",
      leaseTemplateId: null,
      rentalApplicationIsApproved: true,
      rentalApplicationIsArchived: true,
      hasGracePeriod: false,
      paymentMethodId: null,
      createRentalApplication: false,
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);
    // Collect input values
    let payload = {
      count: data.numberOfItems,
      user_id: authUser.user_id,
      unit_mode: data.unitMode,
      rental_unit_id: data.rentalUnitId,
      lease_template_mode: data.leaseTemplateMode,
      lease_template_id: data.leaseTemplateId,
      rental_application_is_approved: data.rentalApplicationIsApproved,
      rental_application_is_archived: data.rentalApplicationIsArchived,
      has_grace_period: data.hasGracePeriod,
      create_rental_application: data.createRentalApplication,
    };

    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(`${process.env.REACT_APP_API_HOSTNAME}/generate/tenants/`, payload)
      .then((response) => {
        console.log("Response ", response);
        if (response.data.status === 201) {
          alert(`Successfully generated ${response.data.count} tenants`);
          setIsLoading(false);
        }
      });
  };
  useEffect(() => {
    getProperties().then((res) => {
      setProperties(res.data);
      //Populate the units array with each of the properties' units
      res.data.forEach((property) => {
        property.units.forEach((unit) => {
          setUnits((units) => [...units, unit]);
        });
      });
    });
    //retrieve lease terms that the user has created
    getLeaseTemplatesByUser().then((res) => {
      setLeaseTemplates(res.data);
      console.log(res);
    });
  }, []);
  return (
    <UIDialog
      open={props.open}
      onClose={props.onClose}
      style={{ padding: "10px", width: "500px" }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "5px" }}
      >
        <h3>Tenant Generator </h3>
        <IconButton
          sx={{ color: "white", float: "right" }}
          edge="start"
          color="inherit"
          onClick={props.onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        {console.log("Form errors ", errors)}
        <div className="form-group my-2">
          <label style={{ color: "white", marginBottom: "10px" }}>
            Number of Tenants
          </label>
          <input
            {...register("numberOfItems", {
              required: "This is a required field",
              min: 1,
              max: 1000,
            })}
            className=""
            style={devToolInputStyle}
            label="Number of Items"
            type="number"
            defaultValue={numberOfItems}
            onChange={(e) => setNumberOfItems(e.target.value)}
          />
          <span style={validationMessageStyle}>
            {errors.numberOfItems && errors.numberOfItems.message}
          </span>
        </div>
        <div className="form-group my-2">
          <label style={{ color: "white" }}>Rental Unit Options</label>
          <select
            {...register("unitMode", {
              required: "This is a required field",
              //Validate that the value is not a blank string
              validate: (value) => value !== "",
            })}
            className="form-select "
            style={{ background: "white", color: "black" }}
            onChange={(e) => setUnitMode(e.target.value)}
            defaultValue={unitMode}
          >
            <option value="">Choose One</option>
            <option value="new">Create a new unit for tenant</option>
            {units.filter((unit) => !unit.is_occupied).length > 0 && (
              <option value="specific">
                Choose from Existing unoccupied Unit
              </option>
            )}
            {units.filter((unit) => !unit.is_occupied).length > 0 && (
              <option value="random">Place tenant in a random unit</option>
            )}
          </select>
          {unitMode === "specific" && (
            <select
              {...register("rentalUnitId", {
                required: "This is a required field",
                //Validate that the value is not a blank string
                validate: (value) => value !== "",
              })}
              className="form-select mt-1"
              style={{ background: "white", color: "black" }}
              onChange={(e) => setRentalUnitId(e.target.value)}
              defaultValue={rentalUnitId}
            >
              <option value="">Choose One</option>
              {units.map((unit) => {
                if (!unit.is_occupied) {
                  return (
                    <option value={unit.id}>
                      Unit {unit.name} @ Property
                      {
                        properties.find(
                          (property) => property.id === unit.rental_property
                        ).name
                      }
                    </option>
                  );
                }
              })}
            </select>
          )}
          <span style={validationMessageStyle}>
            {errors.unitMode && errors.unitMode.message}
          </span>
        </div>
        <div className="form-group my-2">
          <label style={{ color: "white" }}>Lease Term Options</label>
          <select
            {...register("leaseTemplateMode", {
              required: "This is a required field",
              //Validate that the value is not a blank string
              validate: (value) => value !== "",
            })}
            className="form-select "
            style={{ background: "white", color: "black" }}
            onChange={(e) => setLeaseTemplateMode(e.target.value)}
            defaultValue={leaseTemplateMode}
          >
            <option value="">Choose One</option>
            <option value="new">Create a new lease term for tenant</option>
            <option value="specific">Choose from Existing Lease Term</option>
            <option value="random">
              Select a randome lease term for the tenant
            </option>
          </select>
          {leaseTemplateMode === "specific" && (
            <select
              {...register("leaseTemplateId", {
                required: "This is a required field",
                //Validate that the value is not a blank string
                validate: (value) => value !== "",
              })}
              className="form-select mt-1"
              style={{ background: "white", color: "black" }}
              onChange={(e) => setLeaseTemplateId(e.target.value)}
            >
              <option>Select One</option>
              {leaseTemplates.map((leaseTemplate) => (
                <option value={leaseTemplate.id}>
                  {leaseTemplate.term} month lease @${leaseTemplate.rent}/month
                </option>
              ))}
            </select>
          )}
          <span style={validationMessageStyle}>
            {errors.leaseTemplateMode && errors.leaseTemplateMode.message}
            {errors.leaseTemplateId && errors.leaseTemplateId.message}
          </span>
        </div>
        <div className="form-group my-2">
          <label style={{ color: "white" }}>Create Rental Application</label>
          <select
            {...register("createRentalApplication", {
              required: "This is a required field",
              //Validate that the value is not a blank string
              validate: (value) => value !== "",
            })}
            className="form-select "
            style={{ background: "white", color: "black" }}
            onChange={(e) => setCreateRentalApplication(e.target.value)}
          >
            <option value="">Choose One</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          <span style={validationMessageStyle}>
            {errors.createRentalApplication &&
              errors.createRentalApplication.message}
          </span>
        </div>
        {createRentalApplication && (
          <>
            {" "}
            <div className="form-group my-2">
              <label style={{ color: "white" }}>
                Rental Application Approval Options
              </label>
              <select
                {...register("rentalApplicationIsApproved", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                className="form-select "
                style={{ background: "white", color: "black" }}
                onChange={(e) => setRentalApplicationIsApproved(e.target.value)}
                defaultValue={rentalApplicationIsApproved}
              >
                <option value="">Choose One</option>
                <option value={true}>Approve the rental application</option>
                <option value={false}>Deny the rental application</option>
              </select>
              <span style={validationMessageStyle}>
                {errors.rentalApplicationIsApproved &&
                  errors.rentalApplicationIsApproved.message}
              </span>
            </div>
            <div className="form-group my-2">
              <label style={{ color: "white" }}>
                Rental Application Archive Options
              </label>
              <select
                {...register("rentalApplicationIsArchived", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                className="form-select "
                style={{ background: "white", color: "black" }}
                onChange={(e) => setRentalApplicationIsArchived(e.target.value)}
                defaultValue={rentalApplicationIsArchived}
              >
                <option value="">Choose One</option>
                <option value={true}>Archive the rental application</option>
                <option value={false}>
                  Do not archive the rental application
                </option>
              </select>
              <span style={validationMessageStyle}>
                {errors.rentalApplicationIsArchived &&
                  errors.rentalApplicationIsArchived.message}
              </span>
            </div>
          </>
        )}

        <div className="form-group my-2">
          <label style={{ color: "white" }}>Grace Period Options</label>
          <select
            {...register("hasGracePeriod", {
              required: "This is a required field",
              //Validate that the value is not a blank string
              validate: (value) => value !== "",
            })}
            className="form-select "
            style={{ background: "white", color: "black" }}
            onChange={(e) => setHasGracePeriod(e.target.value)}
            defaultValue={hasGracePeriod}
          >
            <option value="">Choose One</option>
            <option value={true}>Add a grace period to the lease</option>
            <option value={false}>
              Do not add a grace period to the lease
            </option>
          </select>
          <span style={validationMessageStyle}>
            {errors.hasGracePeriod && errors.hasGracePeriod.message}
          </span>
        </div>

        {/* Add other input fields for options, if needed */}
        {isLoading ? (
          <Box sx={{ display: "flex" }}>
            <Box m={"55px auto"}>
              <CircularProgress sx={{ color: uiGreen }} />
            </Box>
          </Box>
        ) : (
          <UIButton
            variant="contained"
            style={{ width: "100%", marginTop: "10px" }}
            btnText={`Generate Tenants`}
            type="submit"
          />
        )}
      </form>
    </UIDialog>
  );
};

export default TenantGeneratorForm;
