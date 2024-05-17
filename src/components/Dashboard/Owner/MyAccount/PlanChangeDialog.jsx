import React, { useEffect, useState } from "react";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIButton from "../../UIComponents/UIButton";
import { Stack, Chip, IconButton } from "@mui/material";
import { authUser, token, uiGreen, uiGrey2 } from "../../../../constants";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { changeSubscriptionPlan } from "../../../../api/manage_subscriptions";
import { getUserStripeSubscriptions } from "../../../../api/auth";
import { useNavigate } from "react-router-dom";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import UIStepper from "../../UIComponents/UIStepper";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const PlanChangeDialog = (props) => {
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState();
  const [tax, setTax] = useState(0.05);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePlanConfirm, setShowChangePlanConfirm] = useState(false);
  const [showUpgradeResponseModal, setShowUpgradeResponseModal] =
    useState(false);
  const [upgradeResponseModalTitle, setUpgradeResponseModalTitle] =
    useState("");
  const [upgradeResponseModalMessage, setUpgradeResponseModalMessage] =
    useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    props.onClose();
    setStep(0);
  };

  //Create a function to submit the selected  plan's price_id and product_id to the backend
  const handleSubmit = () => {
    setIsLoading(true);
    let payload = {
      price_id: selectedPlan.price_id,
      product_id: selectedPlan.product_id,
      subscription_id: currentSubscriptionPlan.id,
    };
    changeSubscriptionPlan(payload).then((res) => {
      console.log(res);
      if (res.status === 200) {
        //set the current subscription plan to the new plan usinng set logcalk storage
        localStorage.removeItem("subscriptionPlan");
        localStorage.setItem(
          "subscriptionPlan",
          JSON.stringify(res.subscription)
        );
        setSelectedPlan({});
        setShowUpgradeResponseModal(true);
        setUpgradeResponseModalTitle("Upgrade Successful");
        setUpgradeResponseModalMessage(
          "You have successfully upgraded your plan. You will be billed for the new plan at the end of your current billing cycle."
        );
      } else {
        setShowUpgradeResponseModal(true);
        setUpgradeResponseModalTitle("Upgrade Failed");
        setUpgradeResponseModalMessage(
          res.data.message
            ? res.data.message
            : "Sorry, something went wrong. Please try again."
        );
      }
    }).catch((error) => {
      console.error("Error changing plan:", error);
      setShowUpgradeResponseModal(true);
      setUpgradeResponseModalTitle("Upgrade Failed");
      setUpgradeResponseModalMessage(
        "Sorry, something went wrong. Please try again."
      );
    }).finally(() => {
      setIsLoading(false);
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
    retrieveSubscriptionPlan();
  }, [currentSubscriptionPlan]);
  return (
    <>
      <ConfirmModal
        open={showChangePlanConfirm}
        handleClose={() => setShowChangePlanConfirm(false)}
        title="Change Plan"
        message="Are you sure you want change your plan?"
        cancelBtnText="Cancel"
        confirmBtnText="Change Plan"
        handleConfirm={handleSubmit}
        handleCancel={() => setShowChangePlanConfirm(false)}
      />
      <AlertModal
        open={showUpgradeResponseModal}
        title={upgradeResponseModalTitle}
        message={upgradeResponseModalMessage}
        btnText="Close"
        onClick={() => {
          navigate(0);
        }}
      />
      <ProgressModal open={isLoading} title="Changing your plan..." />
      <UIDialog open={props.open} onClose={handleClose} maxWidth={"xxl"}>
        <div>
          <UIStepper
            step={step}
            steps={["Select Plan", "Confirm"]}
            style={{ margin: "20px 0" }}
          />
          {step === 0 && (
            <div style={{ width: `1000px` }}>
              <div className="row m-3">
                {props.plans.map((plan) => {
                  //   let isCurrentPlan = false;
                  let isCurrentPlan =
                    plan.product_id ===
                    currentSubscriptionPlan.items.data[0].plan.product;
                  return (
                    <div className="col-md-6 col-sm-12 mb-3 py-3 ">
                      <div className="">
                        <div className="card-body">
                          <h5>{plan.name}</h5>
                          {plan.product_id ===
                          process.env.REACT_APP_STRIPE_PRO_PLAN_PRODUCT_ID ? (
                            <Chip
                              label="Best Value"
                              sx={{
                                margin: "5px 0",
                                padding: "0px",
                                color: "White",
                                background: uiGreen,
                              }}
                            />
                          ) : (
                            <Chip
                              label=""
                              sx={{
                                margin: "5px 0",
                                padding: "0px",
                                color: uiGrey2,
                                background: "none",
                              }}
                            />
                          )}
                          <div id="price-info">
                            <Stack
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="center"
                              spacing={2}
                            >
                              <h2 style={{ fontSize: "27pt" }}>
                                ${plan.price}
                              </h2>
                              <Stack
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="baseline"
                                spacing={0}
                              >
                                {plan.product_id ===
                                  process.env
                                    .REACT_APP_STRIPE_PRO_PLAN_PRODUCT_ID && (
                                  <span style={{ color: uiGrey2 }}>
                                    per Rental Unit{" "}
                                  </span>
                                )}
                                <span style={{ color: uiGrey2 }}>
                                  per month
                                </span>
                              </Stack>
                            </Stack>

                            <UIButton
                              style={{
                                width: "100%",
                                margin: "10px 0",
                                backgroundColor: isCurrentPlan
                                  ? uiGrey2
                                  : uiGreen,
                              }}
                              btnText={
                                isCurrentPlan ? "Current Plan" : "Select Plan"
                              }
                              disabled={isCurrentPlan}
                              onClick={() => {
                                setSelectedPlan(plan);
                                console.log(selectedPlan);
                                setStep(1);
                              }}
                            />
                            <Stack
                              direction="column"
                              justifyContent="flex-start"
                              alignItems="flex-start"
                              spacing={2}
                            >
                              <span style={{ color: uiGrey2 }}>
                                This plan includes:
                              </span>
                              {plan.features.map((feature) => (
                                <span style={{ color: uiGrey2 }}>
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
                  );
                })}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                  spacing={2}
                >
                  <span></span>
                  <UIButton btnText="Cancel" onClick={handleClose} />
                </Stack>
              </div>
            </div>
          )}
          {step === 1 && (
            <div style={{ width: "500px", padding: "20px", color: uiGrey2 }}>
              <div>
                <IconButton onClick={() => setStep(0)}>
                  <ArrowBackOutlinedIcon sx={{ color: uiGreen }} />
                </IconButton>
              </div>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <div>
                  <h6 style={{ margin: "10px 0", fontSize: "14pt" }}>
                    {selectedPlan.name}
                  </h6>
                </div>
              </Stack>

              <div id="totals-section">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <span sx={{ color: uiGrey2 }}>Subtotal</span>
                  <span sx={{ color: uiGrey2 }}>${selectedPlan.price}</span>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <span sx={{ color: uiGrey2 }}>Tax</span>
                  <span sx={{ color: uiGrey2 }}>
                    ${selectedPlan.price * tax}
                  </span>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <span sx={{ color: uiGrey2 }}>Total</span>
                  <span sx={{ color: uiGrey2 }}>
                    ${selectedPlan.price * tax + selectedPlan.price}
                  </span>
                </Stack>
              </div>

              {selectedPlan && (
                <>
                  <UIButton
                    style={{ width: "100%", margin: "10px 0" }}
                    className="btn btn-primary d-block  w-100 mb-2"
                    onClick={() => {
                      console.log("Confirm Change Plan");
                      setShowChangePlanConfirm(true);
                      handleClose();
                    }}
                    btnText="Change Plan"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </UIDialog>
    </>
  );
};

export default PlanChangeDialog;
