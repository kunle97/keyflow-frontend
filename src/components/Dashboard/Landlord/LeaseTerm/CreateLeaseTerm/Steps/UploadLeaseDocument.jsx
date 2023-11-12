import React, { useState } from "react";
import StepControl from "./StepControl";
import { createBoldSignEmbeddedTemplateLink } from "../../../../../../api/boldsign";
import UIButton from "../../../../UIComponents/UIButton";
import Dropzone from "react-dropzone";
import { Stack } from "@mui/material";
import { uiGreen, authUser } from "../../../../../../constants";
import ProgressModal from "../../../../UIComponents/Modals/ProgressModal";
import { useEffect } from "react";
import AlertModal from "../../../../UIComponents/Modals/AlertModal";

const UploadLeaseDocument = (props) => {
  const [file, setFile] = useState(null); //TODO: Change to array of files
  const [renderIframe, setRenderIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  //Create handleTemplateEditUpdate function
  const handleTemplateEditUpdate = (event) => {
    if (event.origin !== "https://app.boldsign.com") {
      return;
    }

    switch (event.data.status) {
      case "OnDraftSavedSuccess":
        // handle draft success
        setAlertOpen(false);
        props.handleNextStep();
        break;
      case "onDraftFailed":
        // handle draft failure
        setAlertTitle("Error");
        setAlertMessage(
          "There was an error saving your lease agreement lease agreement  draft."
        );
        setAlertOpen(true);
        break;
      case "onCreateSuccess": // THIS is the funciton that is calle when template is created
        setAlertOpen(false);
        props.handleNextStep();
        break;
      case "onCreateFailed":
        // handle create failure
        setAlertTitle("Error");
        setAlertMessage(
          "There was an error creating your lease agreement template."
        );
        setAlertOpen(true);
        break;
      case "onTemplateEditingCompleted":
        // handle edit success
        props.handleNextStep();
        break;
      case "onTemplateEditingFailed":
        // handle edit failure
        setAlertTitle("Error");
        setAlertMessage(
          "There was an error editing your lease agreement template."
        );
        setAlertOpen(true);
        break;
      default:
        // Display error message
        setAlertTitle("Error");
        setAlertMessage(
          "There was an error processing your document. Please refresh the page and try again."
        );
        setAlertOpen(true);
        break;
    }
  };

  const handleDrop = async (acceptedFiles) => {
    setIsLoading(true);
    console.log("dropzone file", acceptedFiles[0]);
    let accepted_file = acceptedFiles[0];
    const payload = {
      file: acceptedFiles[0],
      template_title: accepted_file.name + " Lease Agreement",
      template_description: accepted_file.name,
      document_title: accepted_file.name,
      document_description: accepted_file.type,
      landlord_name: authUser.first_name + " " + authUser.last_name,
      landlord_email: authUser.email,
    };
    //Call the createBoldSignEmbeddedTemplateLink API
    await createBoldSignEmbeddedTemplateLink(payload).then((res) => {
      console.log(res);
      if (res.status === 201) {
        setIframeUrl(res.url);
        props.setTemplateId(res.template_id);
        console.log("template id", res.template_id);
        console.log("template id state", props.templateId);
        setRenderIframe(true);
        console.log(iframeUrl);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("message", handleTemplateEditUpdate);
    return () => {
      window.removeEventListener("message", handleTemplateEditUpdate);
    };
  }, []);
  return (
    <div>
      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
        handleClose={() => {
          setAlertOpen(false);
        }}
      />
      <ProgressModal open={isLoading} title="Processing your document..." />
      {renderIframe && iframeUrl ? (
        <>
          <iframe
            id="prepare_page"
            src={iframeUrl}
            width="100%"
            height="1200px"
          />
          {/* <StepControl
            step={props.step}
            steps={props.steps}
            handlePreviousStep={props.handlePreviousStep}
            handleNextStep={props.handleNextStep}
          /> */}
        </>
      ) : (
        <div>
          <Dropzone
            onDrop={handleDrop}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            minSize={1024}
            maxSize={3145728}
            maxFiles={1}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => {
              const additionalClass = isDragAccept
                ? "accept"
                : isDragReject
                ? "reject"
                : "";

              return (
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                  {...getRootProps({
                    className: `dropzone ${additionalClass}`,
                  })}
                  style={{
                    width: "100%",
                    height: "400px",
                    border: `1px dashed ${uiGreen}`,
                    marginBottom: "15px",
                  }}
                >
                  <input
                    {...getInputProps()}
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      console.log("onChange file", e.target.files[0]);
                      console.log("onCHange state file", file);
                      handleDrop([e.target.files[0]]);
                    }}
                    type="file"
                    name="file"
                  />

                  <p>
                    Drag'n'drop the file representing your lease agreeement{" "}
                  </p>
                  <p>
                    Only .pdf, .doc, .docx, .png, .jpg, and .jpeg files will be
                    accepted (Max. file size: 3MB)
                  </p>
                  <UIButton btnText="Upload File" type="button" />
                </Stack>
              );
            }}
          </Dropzone>
        </div>
      )}
    </div>
  );
};

export default UploadLeaseDocument;