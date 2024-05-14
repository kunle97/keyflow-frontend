import React, { useEffect, useState } from "react";
import UIButton from "../../UIComponents/UIButton";
import { Stack } from "@mui/material";
import UIPrompt from "../../UIComponents/UIPrompt";
import DeleteButton from "../../UIComponents/DeleteButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import useScreen from "../../../../hooks/useScreen";
import {
  handleChangeLeaseTemplate,
  isValidFileExtension,
  isValidFileName,
} from "../../../../helpers/utils";
import { authUser, uiGreen, uiRed } from "../../../../constants";
import {
  createBoldSignEmbeddedTemplateEditLink,
  createBoldSignEmbeddedTemplateLink,
} from "../../../../api/boldsign";
import UIRadioGroup from "../../UIComponents/UIRadioGroup";
import UIDropzone from "../../UIComponents/Modals/UploadDialog/UIDropzone";
import { authenticatedMediaInstance } from "../../../../api/api";
import { updateUnit } from "../../../../api/units";
import TaskIcon from "@mui/icons-material/Task";
import { uploadFile } from "../../../../api/file_uploads";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { useNavigate } from "react-router-dom";
const UnitDocumentManager = (props) => {
  const { navigate } = useNavigate();
  const [createLink, setCreateLink] = useState(null);
  const [editLink, setEditLink] = useState(null);
  const [signedLeaseViewLink, setSignedLeaseViewLink] = useState(null);
  const [leaseDocumentMode, setLeaseDocumentMode] = useState("blank_lease");
  const [blankLeaseDocumentFile, setBlankLeaseDocumentFile] = useState([]);
  const [signedLeaseDocumentFile, setSignedLeaseDocumentFile] = useState([]);
  const [showDeleteTemplateConfirmModal, setShowDeleteTemplateConfirmModal] =
    useState(false);
  const [
    showDeleteSignedDocumentConfirmModal,
    setShowDeleteSignedDocumentConfirmModal,
  ] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoadingIframe, setIsLoadingIframe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressModalTitle, setProgressModalTitle] = useState("");
  const [renderIframe, setRenderIframe] = useState(false);
  const [unit_id, setUnitId] = useState(props.unit.id);
  const [property_id, setPropertyId] = useState(props.unit.rental_property);
  const [unit, setUnit] = useState(props.unit);
  const [templateId, setTemplateId] = useState(null);
  const [unitLeaseTerms, setUnitLeaseTerms] = useState(
    JSON.parse(props.unit.lease_terms)
  );
  const [iframeUrl, setIframeUrl] = useState("");
  const [addLeaseAgreementDialogIsOpen, setAddLeaseAgreementDialogIsOpen] =
    useState();
  const iconStyles = {
    fontSize: "40px",
    color: "#FFA500",
  };

  const { isMobile } = useScreen();

  //Lease Document functions
  const handleTemplateEditUpdate = (event) => {
    if (event.origin !== "https://app.boldsign.com") {
      return;
    }

    switch (event.data.status) {
      case "OnDraftSavedSuccess":
        // handle draft success
        setAlertOpen(false);
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
        //Insert logic to update the unit with the template id
        setAlertTitle("Success");
        setAlertMessage("Lease Agreement Template Created Successfully");
        setAlertOpen(true);
        if (props.onComplete) {
          props.onComplete();
        }
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

  const retrieveEditLink = async (template_id) => {
    setIsLoading(true);
    setProgressModalTitle("Retrieving Lease Document...");
    console.log("Tempalte ID:", unit.template_id);
    createBoldSignEmbeddedTemplateEditLink({
      template_id: template_id,
    })
      .then((res) => {
        console.log(res);
        setEditLink(res.url);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleChangeLeaseDocumentMode = (event) => {
    setLeaseDocumentMode(event.target.value); // Update selected unit
  };

  const onDropBlankLeaseDocument = async (acceptedFiles) => {
    let validFiles = true;
    setIsLoadingIframe(true);
    acceptedFiles.forEach((file) => {
      if (!isValidFileName(file.name)) {
        setAlertTitle("File Upload Error");
        setAlertMessage(
          "One or more of the file names is invalid. File name can only contain numbers, letters, underscores, and dashes. No special characters or spaces."
        );
        setAlertOpen(true);
        validFiles = false;
        return;
      } else if (!isValidFileExtension(file.name, [".pdf", ".docx", ".doc"])) {
        setAlertTitle("File Upload Error");
        setAlertMessage(
          "One or more of the file types is invalid. Accepted file types: " +
            [".pdf", ".docx", ".doc"].join(", ")
        );
        setAlertOpen(true);
        validFiles = false;
        return;
      }
    });
    if (validFiles) {
      console.log("dropzone file", acceptedFiles[0]);
      let accepted_file = acceptedFiles[0];
      const payload = {
        file: acceptedFiles[0],
        template_title: accepted_file.name + " Lease Agreement",
        template_description: accepted_file.name,
        document_title: accepted_file.name,
        document_description: accepted_file.type,
        owner_name: authUser.first_name + " " + authUser.last_name,
        owner_email: authUser.email,
      };
      //Call the createBoldSignEmbeddedTemplateLink API
      await createBoldSignEmbeddedTemplateLink(payload).then((res) => {
        console.log(res);
        if (res.status === 201) {
          setCreateLink(res.url);
          setRenderIframe(true);
          setTemplateId(res.template_id);
          updateUnit(unit_id, { template_id: res.template_id }).then((res) => {
            console.log(res);
          });
          console.log(iframeUrl);
          setIsLoadingIframe(false);
        }
      });
    }
  };

  //Sigend Lease docoument Functions
  const handleUploadSignedLeaseDocumentSubmit = async (e) => {
    e.preventDefault();
    setAddLeaseAgreementDialogIsOpen(false);
    setIsLoading(true);
    if (!signedLeaseDocumentFile) {
      console.error("No file selected");
      return;
    }

    let signed_lease_document_metadata = {
      lease_start_date: e.target.elements.lease_start_date.value,
      lease_end_date: e.target.elements.lease_end_date.value,
      date_signed: e.target.elements.date_signed.value,
    };

    const payload = {
      file: signedLeaseDocumentFile[0],
      user: authUser.id,
      subfolder:
        "properties/" +
        property_id +
        "/units/" +
        unit_id +
        "/signed_lease_documents/",
    };
    uploadFile(payload).then((res) => {
      console.log(res);
      setIsLoading(false);
      if (res.status === 201) {
        console.log(res);
        let file_id = res.data.id;
        let file = res.data;
        authenticatedMediaInstance
          .patch(`/units/${unit_id}/`, {
            signed_lease_document_file: res.data.id,
            signed_lease_document_metadata: JSON.stringify(
              signed_lease_document_metadata
            ),
          })
          .then((res) => {
            if (res.status === 200) {
              console.log("unit updated");
            } else {
              setAlertOpen(true);
              setAlertTitle("Error");
              setAlertMessage("Something went wrong");
              return;
            }
          });
        setAlertTitle("Update Lease Terms");
        setAlertMessage(
          <>
            <p>
              The current lease terms for this may not be updated to match the
              the terms on the document. It is recommended that you update the
              unit's lease terms now.
            </p>
            <div className="row">
              {unitLeaseTerms.map((preference) => {
                return (
                  <div className="col-md-6">
                    <h6>
                      <strong>{preference.label}</strong>
                    </h6>
                    <p>{preference.value}</p>
                  </div>
                );
              })}
            </div>
          </>
        );
        setAlertOpen(true);
      } else {
        setAlertTitle("File Upload Error");
        setAlertMessage("Something went wrong");
        setAlertOpen(true);
        return;
      }
    });
  };

  const onDropSignedLeaseDocument = async (acceptedFiles) => {
    let validFiles = true;
    setIsLoadingIframe(true);
    acceptedFiles.forEach((file) => {
      if (!isValidFileName(file.name)) {
        setAlertTitle("File Upload Error");
        setAlertMessage(
          "One or more of the file names is invalid. File name can only contain numbers, letters, underscores, and dashes. No special characters or spaces."
        );
        setAlertOpen(true);
        validFiles = false;
        return;
      } else if (!isValidFileExtension(file.name, [".pdf", ".docx", ".doc"])) {
        setAlertTitle("File Upload Error");
        setAlertMessage(
          "One or more of the file types is invalid. Accepted file types: " +
            [".pdf", ".docx", ".doc"].join(", ")
        );
        setAlertOpen(true);
        validFiles = false;
        return;
      }
    });
    if (!validFiles) {
      return;
    }

    // Process valid files
    const updatedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setSignedLeaseDocumentFile(updatedFiles);
  };

  useEffect(() => {
    if (props.unit.template_id) {
      retrieveEditLink(props.unit.template_id);
    }
    if (props.unit.signed_lease_document_file) {
      setSignedLeaseViewLink(props.unit.signed_lease_document_file.file);
    }

    window.addEventListener("message", handleTemplateEditUpdate);
    return () => {
      window.removeEventListener("message", handleTemplateEditUpdate);
    };
  }, [props.unit, alertOpen]);

  return (
    <div>
      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
        onClick={() => {
          navigate(0);
          setAlertOpen(false);
        }}
      />
      <ConfirmModal
        open={showDeleteTemplateConfirmModal}
        title="Delete Template Document"
        message="Are you sure you want to delete this template document?"
        confirmBtnText="Delete"
        cancelBtnText="Cancel"
        confirmBtnStyle={{
          backgroundColor: uiRed,
          color: "white",
        }}
        cancelBtnStyle={{
          backgroundColor: uiGreen,
          color: "white",
        }}
        handleCancel={() => {
          setShowDeleteTemplateConfirmModal(false);
        }}
        handleConfirm={() => {
          console.log("Template ID update");
          //update the unit to set the tempalate_id field to null
          updateUnit(unit_id, {
            template_id: null,
          }).then((res) => {
            if (res.status === 200) {
              console.log("unit updated");
              setShowDeleteTemplateConfirmModal(false);
              setAlertOpen(true);
              setAlertTitle("Success");
              setAlertMessage("Template document deleted successfully");
              navigate(0);
            } else {
              setAlertOpen(true);
              setAlertTitle("Error");
              setAlertMessage("Something went wrong");
              return;
            }
          });
        }}
      />
      {props.unit.template_id && (
        <div>
          <Stack direction="row" justifyContent="flex-end">
            <DeleteButton
              btnText="Delete Template Document"
              onClick={() => {
                setShowDeleteTemplateConfirmModal(true);
              }}
              style={{
                marginBottom: "15px",
              }}
            />
          </Stack>
          <div className="card" style={{ overflow: "hidden" }}>
            <iframe
              src={editLink}
              height={isMobile ? "500px" : "1200px"}
              width="100%"
            />
          </div>
        </div>
      )}
      {props.unit.signed_lease_document_file && (
        <div>
          <UIPrompt
            icon={<TaskIcon style={iconStyles} />}
            title="Manage Signed Lease Agreement"
            message="Use the buttons below to view, download or delete the signed lease agreement."
            body={
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                spacing={2}
                sx={{ margin: "10px 0" }}
              >
                <UIButton
                  onClick={() => {
                    window.open(signedLeaseViewLink, "_blank");
                  }}
                  btnText="View/Download Document"
                  style={{ marginTop: "20px", width: "320px" }}
                />
                <DeleteButton
                  style={{
                    width: "320px",
                  }}
                  btnText="Delete Document"
                  onClick={() => {
                    setShowDeleteSignedDocumentConfirmModal(true);
                  }}
                />
              </Stack>
            }
          />
        </div>
      )}
      {!props.unit.template_id && !props.unit.signed_lease_document_file && (
        <div>
          <AlertModal
            open={alertOpen}
            title={alertTitle}
            message={alertMessage}
            btnText="Okay"
            onClick={() => {
              setAlertOpen(false);
            }}
          />
          {createLink ? (
            <div className="card">
              <iframe
                src={createLink}
                height={isMobile ? "500px" : "1200px"}
                width="100%"
              />
            </div>
          ) : (
            <>
              <UIRadioGroup
                style={{
                  marginBottom: "20px",
                }}
                radioOptions={[
                  {
                    value: "existing_lease",
                    label: "Upload Signed Lease Agreement",
                  },
                  {
                    value: "blank_lease",
                    label: "Upload Unsigned Lease Agreement",
                  },
                ]}
                value={leaseDocumentMode}
                onChange={handleChangeLeaseDocumentMode}
                direction="row"
              />
              {leaseDocumentMode === "blank_lease" ? (
                <div className="card">
                  <div className="card-body">
                    <UIDropzone
                      onDrop={onDropBlankLeaseDocument}
                      acceptedFileTypes={[".pdf,.docx"]}
                      files={blankLeaseDocumentFile}
                      setFiles={setBlankLeaseDocumentFile}
                    />
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body">
                    <form
                      onSubmit={handleUploadSignedLeaseDocumentSubmit}
                      encType="multipart/form-data"
                    >
                      <div className="row">
                        <div className="col-md-12">
                          {" "}
                          <label className="text-black mb-2">
                            <strong>Upload Signed Lease Agreement</strong>
                          </label>
                          <UIDropzone
                            dropzoneStyles={{ height: "190px" }}
                            onDrop={onDropSignedLeaseDocument}
                            acceptedFileTypes={[".pdf,.docx"]}
                            files={signedLeaseDocumentFile}
                            setFiles={setSignedLeaseDocumentFile}
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "100%" }}>
                            <label className="text-black mb-2">
                              <strong>Lease Start Date</strong>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              name="lease_start_date"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: "100%" }}>
                            <label className="text-black mb-2">
                              <strong>Lease End Date</strong>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              name="lease_end_date"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group" style={{ width: "100%" }}>
                            <label className="text-black my-2">
                              <strong>Date Signed </strong>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              name="date_signed"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <UIButton
                        btnText="Submit File"
                        type="submit"
                        style={{ marginTop: "20px", width: "100%" }}
                      />
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UnitDocumentManager;
