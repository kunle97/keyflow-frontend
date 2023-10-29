import { Stack } from "@mui/material";
import React from "react";
import UIButton from "../../../../UIComponents/UIButton";

const StepControl = (props) => {
  return (
    <div style={{ width: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ ...props.style }}
      >
        {props.step > 0 && (
          <div className="form-group  mb-4">
            <UIButton
              onClick={props.handlePreviousStep}
              btnText="Previous"
              color="secondary"
            />
          </div>
        )}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
        >
          {props.skipAllowed && (
            <div className="form-group  mb-4">
              <UIButton
                onClick={props.handleSkipStep}
                btnText="Skip"
                color="secondary"
              />
            </div>
          )}
          {props.step < props.steps.length - 1 && (
            <div className="form-group  mb-4">
              <UIButton onClick={props.handleNextStep} btnText="Next" />
            </div>
          )}
          {props.step === props.steps.length - 1 && (
            <div className="form-group  mb-4">
              <UIButton onClick={props.handleSubmit} btnText="Submit" />
            </div>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

export default StepControl;
