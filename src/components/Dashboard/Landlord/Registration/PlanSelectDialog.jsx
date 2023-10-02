import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { Dialog, Slide, Stack } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { uiGreen, uiGrey1 } from "../../../../constants";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getSubscriptionPlanPrices } from "../../../../api/api";

const PlanSelectDialog = (props) => {
  const [plans, setPlans] = useState([]);
  const Transition = useCallback(
    React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    }),
    []
  );
  useEffect(() => {
    getSubscriptionPlanPrices().then((res) => {
      setPlans(res.products);
      console.log(plans);
    });
  }, []);
  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: uiGrey1,
          boxShadow: "none",
        },
      }}
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={Transition}
      maxWidth={"xxl"}
    >
      <div className="row m-3 ">
        {plans.map((plan) => (
          <div className="col-md-6 col-sm-12 mb-3 py-3 ">
            <div className="">
              <div className="card-body">
                <h5>{plan.name}</h5>
                <div id="price-info">
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="baseline"
                    spacing={1}
                  >
                    <h2>${plan.price}</h2>
                    {plan.billing_scheme.usage_type === "metered" && (
                      <span style={{ color: "white" }}>per Unit </span>
                    )}
                    <span style={{ color: "white" }}>per month</span>
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
                    <span style={{ color: "white" }}>This plan includes:</span>
                    {plan.features.map((feature) => (
                      <span style={{ color: "white" }}>
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
    </Dialog>
  );
};

export default PlanSelectDialog;
