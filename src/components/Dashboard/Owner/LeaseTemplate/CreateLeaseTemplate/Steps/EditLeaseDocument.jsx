import React, { useState } from "react";
import StepControl from "./StepControl";
import { useEffect } from "react";

const EditLeaseDocument = (props) => {
  let templateEditorEmbedURL = "https://app.boldsign.com/document/embed/?templateId=cf280ff2-8ea4-455e-84b9-c502b06e8f52e_XWZD4ja7;b59ee661-aa2c-477c-97f8-85c9beefd018"
  return (
    <div>
      <iframe src={templateEditorEmbedURL} width={"100%"} height={"600px"} />
      <StepControl
        step={props.step}
        steps={props.steps}
        handlePreviousStep={props.handlePreviousStep}
        handleNextStep={props.handleNextStep}
      />
    </div>
  );
};

export default EditLeaseDocument;
