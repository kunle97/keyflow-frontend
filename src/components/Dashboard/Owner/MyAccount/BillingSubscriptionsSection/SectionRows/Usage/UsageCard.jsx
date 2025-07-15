import React from "react";
import { Stack } from "@mui/material";
import UIProgressBar from "../../../../../UIComponents/UIProgressBar";

const UsageCard = (props) => {
  return (
    <div
      style={{
        border: "2px solid #e5e5e5",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <div className="card-body">
        <div className="mb-2">{props.icon}</div>
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={0}
          sx={{
            mt: 2,
            mb: 1,
          }}
        >
          <h4
            className="card-title text-black  text-muted"
            style={{
              fontSize: "12pt",
              marginBottom: 1,
            }}
          >
            {props.usageTitle}
          </h4>
          <h4
            style={{
              fontSize: "21pt",
            }}
          >
            {props.usageCount} of{" "}
            {props.isUnlimited ? "Unlimited" : props.usageTotal}
          </h4>
        </Stack>
        <UIProgressBar
          value={
            props.isUnlimited ? 0 : (props.usageCount / props.usageTotal) * 100
          }
        />
      </div>
    </div>
  );
};

export default UsageCard;
