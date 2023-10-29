import { useEffect, useState } from "react";
import StepControl from "./StepControl";
import { createBoldSignEmbeddedDocumentSendLink } from "../../../../../../api/boldsign";

const SendLeaseDocument = (props) => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [templateId, setTemplateId] = useState(props.templateId);
  const [renderIframe, setRenderIframe] = useState(false);
  useEffect(() => {
    setTemplateId("fa087fee-f907-46a7-8c0c-92730327a129"); //TODO: remove this
    let payload = {
      template_id: templateId,
    };
    createBoldSignEmbeddedDocumentSendLink(payload).then((res) => {
      console.log("send link", res);
    });
  }, []);

  return (
    <div>
      <iframe
        id="prepare_page"
        src={
          "https://app.boldsign.com/document/embed/?templateId=" + templateId
        }
        height="600px"
        width="100%"
        class="frame"
      ></iframe>
      <StepControl
        step={props.step}
        steps={props.steps}
        handlePreviousStep={props.handlePreviousStep}
        handleNextStep={props.handleNextStep}
        skipAllowed={true}
        handleSkipStep={() => {
          props.setSkippedSteps([...props.skippedSteps, props.step]);
          props.handleNextStep();
        }}
      />
    </div>
  );
};

export default SendLeaseDocument;
