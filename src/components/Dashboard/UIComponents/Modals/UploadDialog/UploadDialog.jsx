import React from "react";
import UIDialog from "../UIDialog";
import { authUser, globalMaxFileSize } from "../../../../../constants";
import UIButton from "../../UIButton";
import { useState } from "react";
import { uploadFile } from "../../../../../api/file_uploads";
import AlertModal from "../AlertModal";
import ProgressModal from "../ProgressModal";
import UIDropzone from "./UIDropzone";
import { useNavigate } from "react-router";

const UploadDialog = (props) => {
  const [isLoading, setIsLoading] = useState(false); //create a loading variable to display a loading message while the units are  being retrieved
  const [showFileUploadAlert, setShowFileUploadAlert] = useState(false); //Create a state to hold the value of the alert modal
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [files, setFiles] = useState([]); //Create a files state to hold the files to be uploaded
  const navigate = useNavigate();

  //Create a function to check if file name is valid. It is only valid if it contains numbers, letters, underscores, and dashes. No special characters
  const isValidFileName = (file_name) => {

    const regex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)?$/;
    const isValid = regex.test(file_name);

    return isValid;
  };

  //Create a function that checks the props.acceptedFileTypes array to see if the file extension is valid
  const isValidFileExtension = (file_name) => {

    const file_extension = file_name.split(".").pop();

    const isValid = props.acceptedFileTypes.includes("." + file_extension);

    return isValid;
  };

  const onDrop = (acceptedFiles) => {

    let validFiles = true;
    acceptedFiles.forEach((file) => {
      //Check if file is valid size
      if (file.size > globalMaxFileSize) {
        setResponseTitle("File Upload Error");
        setResponseMessage("File size is too large. Max file size is 3MB");
        setShowFileUploadAlert(true);
        props.onClose();
        validFiles = false;
        return;
      }

      if (!isValidFileName(file.name)) {
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "One or more of the file names is invalid. File name can only contain numbers, letters, underscores, and dashes. No special characters or spaces."
        );
        setShowFileUploadAlert(true);
        props.onClose();
        validFiles = false;
        return;
      } else if (!isValidFileExtension(file.name)) {
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "One or more of the file types is invalid. Accepted file types: " +
            props.acceptedFileTypes.join(", ")
        );
        setShowFileUploadAlert(true);
        props.onClose();
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

    setFiles(updatedFiles);
    setResponseMessage(null);
    setResponseTitle(null);
  };

  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!files) {
      console.error("No file selected");
      return;
    }

    files.forEach((file) => {
      const payload = {
        file: file,
        user: authUser.id,
        subfolder: props.subfolder,
      };

      uploadFile(payload)
        .then((res) => {

          if (res.status === 201) {
            setResponseTitle("File Upload");
            setResponseMessage("File uploaded successfully");
          } else {
            setResponseTitle("File Upload Error");
            setResponseMessage(
              res.message
                ? res.message
                : "An error occured uploading your file."
            );
            setShowFileUploadAlert(true);
            return;
          }
        })
        .catch((error) => {
          console.error("Error uploading file", error);
          setResponseTitle("File Upload Error");
          setResponseMessage(
            error.message
              ? error.message
              : "An error occured uploading your file."
          );
          setShowFileUploadAlert(true);
          return;
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    props.onClose();
    setShowFileUploadAlert(true);
  };

  return (
    <>
      <AlertModal
        open={showFileUploadAlert}
        title={responseTitle}
        message={responseMessage}
        btnText={"Okay"}
        onClick={() => {
          setShowFileUploadAlert(false);
          navigate(0);
        }}
      />
      <ProgressModal open={isLoading} title={"Uploading File..."} />
      <UIDialog
        open={props.open}
        onClose={props.onClose}
        maxWidth="lg"
        style={{ width: "700px", zIndex: 991 }}
      >
        <div style={{ padding: "20px" }}>
          <form onSubmit={handleFileUploadSubmit}>
            <h3 style={{ marginBottom: "10px" }}>Upload a new file</h3>
            <UIDropzone
              onDrop={onDrop}
              acceptedFileTypes={props.acceptedFileTypes}
              files={files}
              setFiles={setFiles}
            />
            <UIButton
              dataTestId="dropzone-upload-file-button"
              type="submit"
              btnText="Upload File"
              style={{ width: "100%" }}
            />
          </form>
        </div>
      </UIDialog>
    </>
  );
};

export default UploadDialog;
