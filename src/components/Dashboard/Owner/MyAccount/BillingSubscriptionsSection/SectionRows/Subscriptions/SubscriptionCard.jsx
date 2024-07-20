import React from "react";
import { uiGreen } from "../../../../../../../constants";
import { Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SubscriptionCard = (props) => {
  return (
    <div
      className=""
      style={{
        border: props.isCurrentPlan
          ? "3px solid " + uiGreen
          : "2px solid #e5e5e5",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        width: "450px",
        flex: "0 0 auto", // Add this line
        margin: "10px",
      }}
    >
      <div className="card-body">
        <h6
          className="card-title text-black"
          style={{
            textTransform: "uppercase",
          }}
        >
          {props.subscriptionName}
        </h6>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          sx={{
            my: 1,
          }}
        >
          <h3
            className="card-subtitle mb-2 text-black text-bold"
            style={{
              fontSize: "33pt",
            }}
          >
            ${props.subscriptionPrice}
          </h3>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="baseline"
            spacing={0}
          >
            {props.isPerUnit && (
              <span className="text-black">per rental unit </span>
            )}
            <span className="text-black">per month</span>
          </Stack>
        </Stack>
        <p className="card-text text-black">{props.subscriptionDescription}</p>
        <div
          className="row my-3"
          style={{
            maxHeight: props.maxHeight ? props.maxHeight : "450px",
            overflow: "hidden",
          }}
        >
          {props.showAllFeatures
            ? props.subscriptionFeatures.map((feature, index) => (
                <div className="col-md-12 mb-2" key={index}>
                  <span className="text-black">
                    <CheckCircleIcon
                      style={{ color: uiGreen, width: "15px" }}
                    />{" "}
                    {feature.name}
                  </span>
                </div>
              ))
            : props.subscriptionFeatures.slice(0, 6).map((feature, index) => (
                <div className="col-md-12 mb-2" key={index}>
                  <span className="text-black">
                    <CheckCircleIcon
                      style={{ color: uiGreen, width: "15px" }}
                    />{" "}
                    {feature.name}
                  </span>
                </div>
              ))}
        </div>
        {props.hideSelectButton ?? (
          <button
            style={{
              background: props.isCurrentPlan ? "#8cd9a2" : uiGreen,
              color: props.isCurrentPlan ? "white" : "white",
              width: "100%",
              border: "none",
              borderRadius: "5px",
              padding: "10px",
            }}
            onClick={!props.isCurrentPlan ? props.selectPlanOnClick : null}
          >
            {props.isCurrentPlan ? "Current Plan" : "Select Plan"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
