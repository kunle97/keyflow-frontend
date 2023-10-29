import { Stack } from "@mui/material";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { uiGreen } from "../../../constants";
import UIButton from "./UIButton";
import { useEffect } from "react";
const UIDropzone = (props) => {
  const [fileNames, setFileNames] = useState([]);
  const handleDrop = (acceptedFiles) => {
    console.log("dropzone file", acceptedFiles[0]);
    props.setFile(acceptedFiles[0]);
    console.log("state file", props.file);
  };
  useEffect(() => {}, [props.file]);
  return (
    <div className="App">
      <Dropzone
        onDrop={handleDrop}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        minSize={1024}
        maxSize={3072000}
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
                  props.setFile(e.target.files[0]);
                  console.log("dropzone file", e.target.files[0]);
                  console.log("state file", props.file);
                }}
                type="file"
                name="file"
              />

              <p>Drag'n'drop the file representing your lease agreeement </p>
              <p>
                Only .pdf, .doc, .docx, .png, .jpg, and .jpeg files will be
                accepted
              </p>
              <UIButton btnText="Upload File" type="button" />
            </Stack>
          );
        }}
      </Dropzone>
    </div>
  );
};

export default UIDropzone;
