import React, { useEffect, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import {
  changeSubscriptionPlan,
  getSubscriptionPlanPrices,
} from "../../../../../../../api/manage_subscriptions";
import { getUserStripeSubscriptions } from "../../../../../../../api/auth";
import AlertModal from "../../../../../UIComponents/Modals/AlertModal";
import { authUser, token, uiGrey2 } from "../../../../../../../constants";
import UIDialog from "../../../../../UIComponents/Modals/UIDialog";
import UIButton from "../../../../../UIComponents/UIButton";
import { listOwnerStripePaymentMethods } from "../../../../../../../api/payment_methods";
import { isValidStripePaymentMethod } from "../../../../../../../helpers/utils";
import ProgressModal from "../../../../../UIComponents/Modals/ProgressModal";
import { useNavigate } from "react-router";

const SubscriptionSection = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [progressTitle, setProgressTitle] = useState("Please Wait...");
  const [plans, setPlans] = useState([]);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState(null);
  const [newSelectedSubscriptionPlan, setNewSelectedSubscriptionPlan] =
    useState(null);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [freePlan, setFreePlan] = useState({
    name: "Free Plan",
    price: "0",
    features: [
      { name: "Accept online rent payments" },
      { name: "Manage Up to 4 rental units" },
      { name: "Communicate directly with tenants" },
      { name: "Manage maintenance requests" },
      { name: "Create and manage leases" },
      { name: "Up To  1 lease template" },
    ],
    product_id: null,
    price_id: null,
  });

  const handleUpdateSubscriptionPlan = () => {
    setProgressTitle("Updating Subscription Plan...");
    setIsLoading(true);
    //Check if user has at lease one valid payment method before changing subscription plan
    if (paymentMethods.length === 0) {
      setResponseTitle("Error");
      setResponseMessage(
        "Please add a payment method before changing subscription plan"
      );
      setShowResponseModal(true);
      return;
    }
    //Loop through payment methods to check if at least one is valid
    let hasValidPaymentMethod = false;
    paymentMethods.forEach((paymentMethod) => {
      if (isValidStripePaymentMethod(paymentMethod)) {
        hasValidPaymentMethod = true;
      }
    });
    if (!hasValidPaymentMethod) {
      setResponseTitle("Error");
      setResponseMessage(
        "Please add at least one valid payment method before changing subscription plan"
      );
      setShowResponseModal(true);
      return;
    }

    if (paymentMethods.length > 0 && hasValidPaymentMethod) {
      changeSubscriptionPlan({
        user_id: authUser.id,
        price_id: newSelectedSubscriptionPlan.price_id,
        product_id: newSelectedSubscriptionPlan.product_id,
        subscription_id: currentSubscriptionPlan
          ? currentSubscriptionPlan.id
          : null,
      })
        .then((res) => {
          if (res.status === 200) {
            setResponseTitle("Success");
            setResponseMessage("Subscription plan changed successfully");
            setShowResponseModal(true);
          } else {
            setResponseTitle("Error");
            setResponseMessage(
              res.data?.message
                ? res.data.message
                : "Error changing subscription plan. Please try again later."
            );
            setShowResponseModal(true);
          }
        })
        .catch((error) => {
          setResponseTitle("Error");
          setResponseMessage("Error changing subscription plan");
          setShowResponseModal(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    // Get subscription plans
    getSubscriptionPlanPrices()
      .then((res) => {
        setPlans(res.products);
      })
      .catch((error) => {
        setResponseTitle("Error");
        setResponseMessage("Error getting subscription plans");
        setShowResponseModal(true);
      });
    getUserStripeSubscriptions(authUser.id, token).then((res) => {
      setCurrentSubscriptionPlan(res.subscriptions ? res.subscriptions : null);
    });
    listOwnerStripePaymentMethods().then((res) => {
      setPaymentMethods(res.payment_methods.data);
    });
  }, []);

  return (
    <>
      <ProgressModal open={isLoading} title={progressTitle} />
      <AlertModal
        open={showResponseModal}
        onClick={() => {
          navigate(0);
          setShowResponseModal(false);
        }}
        title={responseTitle}
        message={responseMessage}
        btnText="Okay"
      />
      <UIDialog
        open={showChangePlanModal}
        onClose={() => setShowChangePlanModal(false)}
        maxWidth={"md"}
      >
        <SubscriptionCard
          subscriptionName={newSelectedSubscriptionPlan?.name}
          subscriptionPrice={newSelectedSubscriptionPlan?.price}
          subscriptionDescription={newSelectedSubscriptionPlan?.description}
          subscriptionFeatures={newSelectedSubscriptionPlan?.features}
          isPerUnit={
            newSelectedSubscriptionPlan?.product_id ===
              process.env.REACT_APP_STRIPE_OWNER_PROFESSIONAL_PLAN_PRODUCT_ID ||
            newSelectedSubscriptionPlan?.product_id ===
              process.env.REACT_APP_STRIPE_OWNER_ENTERPRISE_PLAN_PRODUCT_ID
              ? true
              : false
          }
          isCurrentPlan={false}
          selectPlanOnClick={() => {
            changeSubscriptionPlan({
              user_id: authUser.id,
              plan_id: newSelectedSubscriptionPlan.product_id,
            })
              .then((res) => {
                setResponseTitle("Success");
                setResponseMessage("Subscription plan changed successfully");
                setShowResponseModal(true);
              })
              .catch((error) => {
                setResponseTitle("Error");
                setResponseMessage("Error changing subscription plan");
                setShowResponseModal(true);
              });
          }}
          hideSelectButton={true}
          showAllFeatures={true}
          maxHeight={"none"}
        />
        <UIButton
          style={{ margin: "10px 0" }}
          btnText="Confirm Plan Change"
          onClick={() => handleUpdateSubscriptionPlan()}
        />
      </UIDialog>
      <div
        className="subscriptions-row"
        style={{
          display: "flex", // Add this line
          flexDirection: "row", // Add this line
          overflowX: "auto",
          width: "100%",
          height: "450px",
          paddingBottom: "20px",
        }}
      >
        {/* ADd Subscription  card for free plan*/}
        <SubscriptionCard
          subscriptionName="Free Plan"
          subscriptionPrice="0"
          subscriptionFeatures={[
            { name: "Accept online rent payments" },
            { name: "Manage Up to 1 rental property" },
            { name: "Manage Up to 4 rental units" },
            { name: "Communicate directly with tenants" },
            { name: "Manage maintenance requests" },
            { name: "Create and manage leases" },
            { name: "Up To  1 lease template" },
          ]}
          isPerUnit={false}
          isCurrentPlan={currentSubscriptionPlan === null}
          selectPlanOnClick={() => {
            setNewSelectedSubscriptionPlan(freePlan);
            setShowChangePlanModal(true);
          }}
        />
        {plans.map((plan) => {
          let isTrialMode =false
          if( currentSubscriptionPlan.status == "trialing" && plan.product_id === process.env.REACT_APP_STRIPE_OWNER_ENTERPRISE_PLAN_PRODUCT_ID){
            isTrialMode = true
          }
          console.log(currentSubscriptionPlan)
          return (
            <SubscriptionCard
              key={plan.product_id}
              subscriptionName={plan.name}
              subscriptionPrice={plan.price}
              isTrialMode={isTrialMode}
              trialEnd={currentSubscriptionPlan.trial_end}
              subscriptionDescription={
                plan.description ? plan.description : null
              }
              subscriptionFeatures={plan.features}
              isPerUnit={
                plan.product_id ===
                  process.env
                    .REACT_APP_STRIPE_OWNER_PROFESSIONAL_PLAN_PRODUCT_ID ||
                plan.product_id ===
                  process.env.REACT_APP_STRIPE_OWNER_ENTERPRISE_PLAN_PRODUCT_ID
                  ? true
                  : false
              }
              isCurrentPlan={
                plan.product_id === currentSubscriptionPlan?.plan.product
              }
              selectPlanOnClick={() => {
                setNewSelectedSubscriptionPlan(plan);
                setShowChangePlanModal(true);
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default SubscriptionSection;
