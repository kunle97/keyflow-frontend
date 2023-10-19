import React, { useState } from "react";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import axios from "axios";
import { authUser, token, uiGrey1 } from "../../../../constants";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack } from "@mui/material";
import { useEffect } from "react";
import { getProperties } from "../../../../api/properties";
import { getUserStripeSubscriptions } from "../../../../api/auth";
const UnitGeneratorForm = (props) => {
  const [numberOfItems, setNumberOfItems] = useState(10); // Default value
  const [properties, setProperties] = useState([]); // Default value
  const [selectedPropertyId, setSelectedPropertyId] = useState(null); // Default value
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
  const handleGenerateData = (dataType) => {
    // Collect input values
    const data = {
      count: numberOfItems,
      user_id: authUser.id,
      rental_property: selectedPropertyId,
      subscription_id: currentSubscriptionPlan.id,
      product_id: currentSubscriptionPlan.plan.product,
    };

    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(`${process.env.REACT_APP_API_HOSTNAME}/generate/units/`, data)
      .then((response) => {
        console.log("Response ", response);
        if (response.data.status === 201) {
          alert(`Successfully generated ${response.data.count} ${dataType}`);
        }
      });
  };
  const retrieveSubscriptionPlan = async () => {
    const res = await getUserStripeSubscriptions(authUser.id, token).then(
      (res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      }
    );
    return res;
  };

  useEffect(() => {
    //Retrieve all users properties
    getProperties().then((res) => {
      setProperties(res.data);
    });
    retrieveSubscriptionPlan();
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
        sx={{ marginBottom: "20px" }}
      >
        <h3>Unit Generator </h3>
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
      <form>
        <div className="form-group my-3">
          <label style={{ color: "white", marginBottom: "10px" }}>
            Number of Units
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

        <div className="form-group my-3">
          <label style={{ color: "white", marginBottom: "10px" }}>
            Select A Property
          </label>
          <select
            name="rental_property"
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="form-control card"
            style={{ width: "100%" }}
          >
            <option value={null}>Randomizer</option>
            {properties.map((property) => {
              return <option value={property.id}>{property.name}</option>;
            })}
          </select>{" "}
        </div>
        {/* Add other input fields for options, if needed */}
        <UIButton
          variant="contained"
          onClick={() => {
            handleGenerateData(props.dataType); // Pass the data type
            props.onClose();
          }}
          style={{ width: "100%" }}
          btnText={`Generate units`}
        />
      </form>
    </UIDialog>
  );
};

export default UnitGeneratorForm;
