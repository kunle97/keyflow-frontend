import React from "react";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

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
    marginBottom: "15px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  };

  const textStyles = {
    color: "white",
    padding: "10px",
    textAlign: "center",
  };
  const previewStyles = {
    display: "flex",
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

  return (
    <>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <div>
          <p style={textStyles}>Drag'n'drop your file</p>
          <p style={textStyles}>
            Accepted file types: {props.acceptedFileTypes.join(", ")}
            (Max. file size: 3MB)
          </p>
        </div>
      </div>
      {props.files.length > 0 && (
        <div style={previewStyles}>
          {props.files.map((file, index) => (
            <div
              key={index}
              style={{ position: "relative" }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <img
                src={file.preview}
                alt={`Preview ${index}`}
                style={previewImageStyles}
              />
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
          ))}
        </div>
      )}
    </>
  );
};

export default UIDropzone;