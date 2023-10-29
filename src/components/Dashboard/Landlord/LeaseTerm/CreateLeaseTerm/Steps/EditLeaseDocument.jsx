import React, { useState } from "react";
import StepControl from "./StepControl";
import { useEffect } from "react";

const EditLeaseDocument = (props) => {
  const [templateId, setTemplateId] = useState(
    "8e510358-654c-46e1-b7c5-9012242f30e0"
  ); //TODO: Get template id from previous step [UploadLeaseDocument
  const [envelopeId, setEnvelopeId] = useState(
    "684bd0f9-bd65-4825-add7-3738bbd65b90"
  ); //TODO: Get envelope id from previous step [SendLeaseDocument
  const [templateEditorIFrameURL, setTemplateEditorIFrameURL] = useState(null);
  let envelopeCoprrectIframeURL =
    "https://appdemo.docusign.com/auth-from-console?code=d7132461-abf0-49a9-92b8-0c1d29f78576&t=de54a42e-1071-48cb-a5d3-e7b145c69ee7&from=https%3A%2F%2Fdemo.docusign.net&view=true&DocuEnvelope=684bd0f9-bd65-4825-add7-3738bbd65b90&e=684bd0f9-bd65-4825-add7-3738bbd65b90&accountId=bde69618-354d-43dc-8cdc-7df2773bc104&a=correct&advcorrect=1&vt=1";
  let envelopeEditIframeURL =
    "https://appdemo.docusign.com/auth-from-console?code=435b92a5-d12c-4259-a571-757f3a42f8b9&t=bdfb29c8-ed04-4f89-9404-a1a45cf58fbc&from=https%3A%2F%2Fdemo.docusign.net&view=true&DocuEnvelope=684bd0f9-bd65-4825-add7-3738bbd65b90&e=684bd0f9-bd65-4825-add7-3738bbd65b90&send=1&accountId=bde69618-354d-43dc-8cdc-7df2773bc104&a=tag&vt=2";
  /**Get Access TOken Before continuing: https://developers.docusign.com/platform/auth/authcode/authcode-get-token/
   * Docusign Steps
   * Step 1: Create a Docusiugn user on your account (If not created already)
   * Step 2: Retrieve uploaded document from previous step
   * Step 3:
   * Step 4:  GEnerate template editor URL using the account id and template id in the format: /restapi/v2.1/accounts/${process.env.REACT_APP_DOCUSIGN_ACCOUNT_ID}/templates/{templateId}/views/edit
   * Step 5: Load iFrame with the template editor URL
   * Step 6: Once user is done editing and saving the template. Prompt them to navigate to the next step
   */

  let templateEditorEmbedURL = "https://app.boldsign.com/document/embed/?templateId=cf280ff2-8ea4-455e-84b9-c502b06e8f52e_XWZD4ja7;b59ee661-aa2c-477c-97f8-85c9beefd018"
  useEffect(() => {
 
    // // console.log("templateEditorAPIURL: ", envelopeEditViewURL);
    // axios
    //   .get(envelopeEditViewURL, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     params: {
    //       accountId: process.env.REACT_APP_DOCUSIGN_ACCOUNT_ID,
    //       envelopeId: envelopeId,
    //     },
    //   })
    //   .then((response) => {
    //     console.log("ZXresponse.data.url: ", response.data.url);
    //     setTemplateEditorIFrameURL(response.data.url);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

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
