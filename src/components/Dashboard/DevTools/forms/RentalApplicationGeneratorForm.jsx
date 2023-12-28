import React, { useState } from "react";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import axios from "axios";
import { authUser, uiGreen, uiGrey1, uiGrey } from "../../../../constants";
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import { useEffect } from "react";
import { getProperties } from "../../../../api/properties";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
const RentalApplicationGeneratorForm = (props) => {
  const [numberOfItems, setNumberOfItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [unitMode, setUnitMode] = useState("");
  const [rentalUnitId, setRentalUnitId] = useState(null);
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

  const onSubmit = (data) => {
    setIsLoading(true);
    // Collect input values

    let payload = {
      count: data.numberOfItems,
      user_id: authUser.user_id,
      unit_mode: data.unitMode,
      rental_unit_id: data.rentalUnitId,
      rental_application_is_approved: data.rentalApplicationIsApproved,
      rental_application_is_archived: data.rentalApplicationIsArchived,
    };
    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/generate/rental-applications/`,
        payload
      )
      .then((response) => {
        console.log("Response ", response);
        if (response.data.status === 201) {
          alert(`Successfully generated ${numberOfItems} rental-applications`);
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
  }, []);
  return (
    <UIDialog
      open={props.open}
      onClose={props.onClose}
      style={{ padding: "10px", width: "500px", background: uiGrey}}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "20px" }}
      >
        <h3>Rental Application Generator </h3>
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
      {isLoading ? (
        <Box sx={{ display: "flex" }}>
          <Box m={"55px auto"}>
            <CircularProgress sx={{ color: uiGreen }} />
          </Box>
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group my-3">
            <label style={{ color: "white", marginBottom: "10px" }}>
              Number of Rental Applications
            </label>
            <input
              className="form-control card"
              style={{ background: `${uiGrey1} !important`, color: "black" }}
              label="Number of Items"
              type="number"
              value={numberOfItems}
              onChange={(e) => setNumberOfItems(e.target.value)}
            />
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
          <UIButton
            variant="contained"
            type="submit"
            style={{ width: "100%" }}
            btnText={`Generate Rental Applications`}
          />
        </form>
      )}
    </UIDialog>
  );
};

export default RentalApplicationGeneratorForm;
