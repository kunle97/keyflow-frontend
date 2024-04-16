import React, { useEffect, useState } from "react";
import UIRadioGroup from "./UIComponents/UIRadioGroup";
import BackButton from "./UIComponents/BackButton";
import Dropzone from "react-dropzone";
import { Stack } from "@mui/material";
import UIButton from "./UIComponents/UIButton";
import useScreen from "../../hooks/useScreen";
import { uiGreen, uiGrey } from "../../constants";
import { authenticatedMediaInstance } from "../../api/api";
import { getProperties } from "../../api/properties";
import AlertModal from "./UIComponents/Modals/AlertModal";

const ImportDataForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [importMode, setImportMode] = useState("properties");
  // const [uploadEndpoint, setUploadEndpoint] = useState("");
  const [properties, setProperties] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const { isMobile } = useScreen();
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    let formIsValid = false;
    let alertTitle = "";
    let alertMessage = "";
    let uploadEndpoint = "";
    try {
      if (importMode === "units" && !selectedPropertyId) {
        formIsValid = false;
        alertTitle = "Property Not Selected";
        alertMessage =
          "Please select the property you would like to upload units to.";
      } else if (!file) {
        formIsValid = false;
        alertTitle = "No File Selected";
        alertMessage = "Please select a file to upload.";
      } else {
        formIsValid = true;
      }

      if (formIsValid) {
        let payload = { file };

        if (importMode === "properties") {
          uploadEndpoint =
            process.env.REACT_APP_API_HOSTNAME +
            "/properties/upload-csv-properties/";
        } else if (importMode === "units") {
          uploadEndpoint =
            process.env.REACT_APP_API_HOSTNAME +
            `/properties/${selectedPropertyId}/upload-csv-units/`;
        }
        console.log("IMport MOde: ", importMode);
        const response = await authenticatedMediaInstance.post(
          uploadEndpoint,
          payload
        );

        console.log("Response:", response);
        if (response.status === 201) {
          setFile(null);
          setAlertModalTitle("Success");
          setAlertModalMessage("Data imported successfully");
          setAlertModalOpen(true);
        } else {
          setAlertModalTitle("Error");
          setAlertModalMessage(
            "An error occurred while importing data. Please try again."
          );
          setAlertModalOpen(true);
        }
      }

      if (!formIsValid) {
        setAlertModalOpen(true);
        setAlertModalTitle(alertTitle);
        setAlertModalMessage(alertMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertModalOpen(true);
      setAlertModalTitle("Error");
      setAlertModalMessage(
        "An error occurred while importing data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (properties === null) {
      getProperties().then((res) => {
        if (res) {
          setProperties(res.data);
        }
      });
    }
  }, [properties]);

  return (
    <>
      <AlertModal
        open={alertModalOpen}
        onClick={() => setAlertModalOpen(false)}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText="Okay"
      />
      <span className="text-muted">
        Select from one of the options below to import your property or units
        from a csv file
      </span>{" "}
      <form encType="multipart/form-data">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <UIRadioGroup
            radioOptions={[
              { label: "Properties", value: "properties" },
              { label: "Units", value: "units" },
            ]}
            value={importMode}
            onChange={(e) => setImportMode(e.target.value)}
          />

          {importMode === "units" && (
            <select
              style={{
                borderRadius: "5px",
                border: "none",
                padding: "5px",
                backgroundColor: uiGrey,
              }}
              onChange={(e) => {
                setSelectedPropertyId(e.target.value);
              }}
            >
              <option value={null}>Select Property</option>
              {properties &&
                properties.map((property, index) => {
                  return (
                    <option key={index} value={property.id}>
                      {property.name}
                    </option>
                  );
                })}
            </select>
          )}
        </Stack>
        <Dropzone
          onDrop={(acceptedFiles) => {
            console.log("Accepted Files:", acceptedFiles); // Log accepted files
            if (acceptedFiles.length > 0) {
              setFile(acceptedFiles[0]); // Set the first accepted file
            } else {
              console.log("No files were dropped or selected.");
            }
          }}
          accept=".csv"
          minSize={1}
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
                  height: isMobile ? "inherit" : "400px",
                  border: isMobile ? "none" : `1px dashed ${uiGreen}`,
                  marginBottom: "15px",
                }}
              >
                <input {...getInputProps()} type="file" name="file" />

                {!isMobile && (
                  <div>
                    <p className="text-black text-center px-2">
                      {isDragActive
                        ? "Drop your file(s) here"
                        : `Drag'n'drop the file containing data for your ${importMode}`}
                    </p>
                    {file ? (
                      <p className="text-black text-center px-2">{file.name}</p>
                    ) : (
                      <p className="text-black text-center px-2">
                        Only a .csv file will be accepted (Max. file
                        size: 3MB)
                      </p>
                    )}
                  </div>
                )}
                <UIButton btnText="Upload File" type="button" />
              </Stack>
            );
          }}
        </Dropzone>
        {importMode === "properties" && (
          <span className="text-black mb-2">
            * For property imports the file must contain the following column
            headers: name, street, city, state, zip_code, and country. All
            lowercase and spaces.
          </span>
        )}
        {importMode === "units" && (
          <span className="text-black mb-2">
            * For unit imports a property must be created and selected from the
            dropdown. The file must contain the following columns: name, beds,
            baths, size. All lowercase and spaces.
          </span>
        )}
        <UIButton
          btnText="Import Data"
          type="button"
          style={{
            width: "100%",
          }}
          onClick={handleSubmit}
        />
      </form>
      {/* <div className="card">
        <div className="card-body"></div>
      </div> */}
    </>
  );
};

export default ImportDataForm;
