import React from "react";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import UIButton from "../../UIButton";

const UIDropzone = (props) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: props.onDrop,
    multiple: true,
  });
  const dropzoneStyles = {
    border: "2px dashed #eee",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    width: "100%",
    height: "400px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  };

  const textStyles = {
    color: "black",
    textAlign: "center",
    padding: "0",
    margin: "0",
    marginBottom: "10px",
  };
  const previewStyles = {
    display: "inline-block",
    margin: "20px 0",
    overflow: "auto",
    height: "120px",
  };

  const previewImageStyles = {
    position: "relative",
    width: "100px",
    height: "100px",
    objectFit: "cover",
    margin: "0 10px",
    cursor: "pointer",
  };

  const overlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    fontSize: "14px",
    visibility: "hidden",
    opacity: 0,
    transition: "visibility 0s, opacity 0.3s linear",
  };

  const fileOverlay = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const handleMouseEnter = (index) => {
    const overlays = document.querySelectorAll(".preview-overlay");
    overlays[index].style.visibility = "visible";
    overlays[index].style.opacity = 1;
  };

  const handleMouseLeave = (index) => {
    const overlays = document.querySelectorAll(".preview-overlay");
    overlays[index].style.visibility = "hidden";
    overlays[index].style.opacity = 0;
  };
  const deleteFile = (index) => {
    const newFiles = [...props.files];
    newFiles.splice(index, 1);
    props.setFiles(newFiles);
  };

  //Create a function to check if a file is an image file
  function isImage(file) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i;
    return allowedExtensions.test(file.name);
  }

  return (
    <>
      <div
        {...getRootProps()}
        style={{ ...dropzoneStyles, ...props.dropzoneStyles }}
        data-testId="file-dropzone"
      >
        <input {...getInputProps()} data-testId="file-dropzone-input" 
        />
        <div>
          <p style={textStyles}>Drag and drop your file</p>
          <p style={textStyles}>
            Accepted file types: {props.acceptedFileTypes.join(", ")} (Max. file
            size: 3MB)
          </p>
          <span className="text-black">
            {props.files.length > 0 ? (
              <div>
                {props.files.map((file, index) => (
                  <strong>
                    <span key={index}>{file.name}</span>
                  </strong>
                ))}
              </div>
            ) : (
              <div>
                <UIButton btnText="Upload File" type="button" />
              </div>
            )}
          </span>
        </div>
      </div>
      {props.files.length > 0 &&
        props.files.map((file, index) => (
          <div key={index} style={isImage(file) ? previewStyles : {}}>
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {isImage(file) && (
                <img
                  src={file.preview}
                  alt={`Preview ${index}`}
                  style={previewImageStyles}
                />
              )}
              <div className="preview-overlay" style={overlayStyles}>
                <div style={fileOverlay}>
                  <p style={{ margin: "0" }}>{file.name}</p>
                  <IconButton
                    onClick={() => deleteFile(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <DeleteIcon style={{ color: "white" }} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default UIDropzone;
