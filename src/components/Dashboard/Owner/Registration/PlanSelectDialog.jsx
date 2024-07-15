import React from "react";
import { useState, useEffect } from "react";
import { Chip, Stack } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { uiGreen, uiGrey1 } from "../../../../constants";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getSubscriptionPlanPrices } from "../../../../api/manage_subscriptions";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const PlanSelectDialog = (props) => {
  const [plans, setPlans] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [freePlan, setFreePlan] = useState({
    name: "Free Plan",
    price: 0,
    product_id: null,
    features: [
      { name: "Accept online rent payments" },
      { name: "Manage Up to 4 rental units" },
      { name: "Communicate directly with tenants" },
      { name: "Manage maintenance requests" },
    ],
  });
  return (
    <>
      <AlertModal
        open={showAlert}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
      <UIDialog open={props.open} onClose={props.onClose} maxWidth={"xxl"}>
        <div className="row m-3 ">
          {/* Create a Column for Free plan */}
          <div className="col-md-6 col-sm-12 mb-3 py-3 ">
            <div className="">
              <div className="card-body">
                <h5>{freePlan.name}</h5>
                <div id="price-info">
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                  >
                    <h2 style={{ fontSize: "27pt" }}>${freePlan.price}</h2>
                    <Stack
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="baseline"
                      spacing={0}
                    >
                      <span className="text-black">per month</span>
                    </Stack>
                  </Stack>
                  <UIButton
                    style={{ width: "100%", margin: "10px 0" }}
                    btnText="Select Plan"
                    onClick={() => {
                      props.setSelectedPlan(freePlan);
                      console.log(props.selectedPlan);
                      props.onClose();
                    }}
                  />
                  <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <span className="text-black">This plan includes:</span>
                    {freePlan.features.map((feature) => (
                      <span className="text-black">
                        <CheckCircleIcon
                          style={{ color: uiGreen, width: "15px" }}
                        />{" "}
                        {feature.name}
                      </span>
                    ))}
                  </Stack>
                </div>
              </div>
            </div>
          </div>
          {props.plans.map((plan) => (
            <div className="col-md-6 col-sm-12 mb-3 py-3 ">
              <div className="">
                <div className="card-body">
                  <h5>{plan.name}</h5>

                  <div id="price-info">
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={2}
                    >
                      <h2 style={{ fontSize: "27pt" }}>${plan.price}</h2>
                      <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="baseline"
                        spacing={0}
                      >
                        {(plan.product_id === process.env.REACT_APP_STRIPE_OWNER_PROFESSIONAL_PLAN_PRODUCT_ID || plan.product_id === process.env.REACT_APP_STRIPE_OWNER_ENTERPRISE_PLAN_PRODUCT_ID) && (
                          <span className="text-black">per Rental Unit </span>
                        )}
                        <span className="text-black">per month</span>
                      </Stack>
                      {plan.product_id ===
                      process.env
                        .REACT_APP_STRIPE_OWNER_PROFESSIONAL_PLAN_PRODUCT_ID ? (
                        <Chip
                          label="Best Value"
                          sx={{
                            margin: "5px 0",
                            padding: "0px",
                            color: "white",
                            background: uiGreen,
                          }}
                        />
                      ) : (
                        <Chip
                          label=""
                          sx={{
                            margin: "5px 0",
                            padding: "0px",
                            color: "white",
                            background: "none",
                          }}
                        />
                      )}
                    </Stack>

                    <UIButton
                      style={{ width: "100%", margin: "10px 0" }}
                      btnText="Select Plan"
                      onClick={() => {
                        props.setSelectedPlan(plan);
                        console.log(props.selectedPlan);
                        props.onClose();
                      }}
                    />
                    <Stack
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <span className="text-black">This plan includes:</span>
                      {plan.features.map((feature) => (
                        <span className="text-black">
                          <CheckCircleIcon
                            style={{ color: uiGreen, width: "15px" }}
                          />{" "}
                          {feature.name}
                        </span>
                      ))}
                    </Stack>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </UIDialog>
    </>
  );
};

export default PlanSelectDialog;
