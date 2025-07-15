import { Stack } from "@mui/material";
import React from "react";

const UIPrompt = (props) => {
  return (
    <div
      data-testId={props.dataTestId ? props.dataTestId : "prompt"}
      style={props.style}
      className={`${props.hideBoxShadow ? "" : "card"} mb-2`}
    >
      <Stack
        direction={"column"}
        alignContent={"center"}
        justifyContent={"center"}
        alignItems={"center"}
        spacing={2}
        sx={{ padding: "5rem 1rem", ...props.style }}
      >
        <span
          data-testId={
            props.dataTestId ? props.dataTestId + "-icon" : "prompt-icon"
          }
        >
          {props.icon}
        </span>
        <h4
          data-testId={
            props.dataTestId ? props.dataTestId + "-title" : "prompt-title"
          }
        >
          {props.title}
        </h4>
        <p
          data-testId={
            props.dataTestId ? props.dataTestId + "-message" : "prompt-message"
          }
          style={{
            textAlign: "center",
            padding: "0  10px",
            color: "black",
          }}
        >
          {props.message}
        </p>
        <div
          data-testId={
            props.dataTestId ? props.dataTestId + "-body" : "prompt-body"
          }
        >
          {props.body}
        </div>
      </Stack>
    </div>
  );
};

export default UIPrompt;
