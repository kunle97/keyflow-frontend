import { useEffect, useState } from "react";
import StepControl from "./StepControl";
import { createBoldSignEmbeddedDocumentSendLink } from "../../../../../../api/boldsign";
import AlertModal from "../../../../UIComponents/Modals/AlertModal";
const SendLeaseDocument = (props) => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [templateId, setTemplateId] = useState(props.templateId);
  const [renderIframe, setRenderIframe] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  
  useEffect(() => {
    setTemplateId("fa087fee-f907-46a7-8c0c-92730327a129"); //TODO: remove this
    let payload = {
      template_id: templateId,
    };
    createBoldSignEmbeddedDocumentSendLink(payload)
      .then((res) => {
        console.log("send link", res);
      })
      .catch((error) => {
        console.error("Error creating send link:", error);
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "An error occurred while creating the send link. Please try again."
        );
        setAlertModalOpen(true);
      });
  }, []);

  return (
    <div>
      <AlertModal
        open={alertModalOpen}
        onClick={() => setAlertModalOpen(false)}
        title={alertModalTitle}
        message={alertModalMessage}
      />
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
