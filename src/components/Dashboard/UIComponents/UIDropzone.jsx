import { Stack } from "@mui/material";
import React from "react";
import Dropzone from "react-dropzone";
import { uiGreen } from "../../../constants";
import UIButton from "./UIButton";
import { useEffect } from "react";
const UIDropzone = (props) => {
  const handleDrop = (acceptedFiles) => {

    props.setFile(acceptedFiles[0]);

  };
  useEffect(() => {}, [props.file]);
  return (
    <div className="App">
      <Dropzone
        onDrop={handleDrop}
        accept={props.allowedFileTypes.join(",")}
        minSize={1024}
        maxSize={props.maxFileSize ? props.maxFileSize : 3145728}
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


                }}
                type="file"
                name="file"
              />

              <p className="text-black">
                Drag'n'drop the file representing your lease agreeement{" "}
              </p>
              <p className="text-black">
                Only the following files will be accepted:{" "}
                {props.allowedFileTypes.join(", ")}
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
