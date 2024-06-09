import React, { useEffect, useState } from "react";
import UITableMobileCard from "../UICards/UITableMobileCard";
import {
  uiGrey2,
  uiGreen,
  defaultWhiteInputStyle,
} from "../../../../constants";
import {
  Button,
  ButtonBase,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import UIDropdown from "../UIDropdown";
import useScreen from "../../../../hooks/useScreen";
import {
  authenticatedInstance,
  authenticatedMediaInstance,
} from "../../../../api/api";
import UIProgressPrompt from "../UIProgressPrompt";
import UIPrompt from "../UIPrompt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import UIDialog from "../Modals/UIDialog";
import UIDropzone from "../Modals/UploadDialog/UIDropzone";
import AlertModal from "../Modals/AlertModal";
import UIButton from "../UIButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  isValidFileExtension,
  isValidFileName,
} from "../../../../helpers/utils";
import ProgressModal from "../Modals/ProgressModal";
const UITableMobile = (props) => {
  const [files, setFiles] = useState([]); //Create a files state to hold the files to be uploaded

  const navigate = useNavigate();
  const { isMobile, screenWidth, breakpoints } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); //Create a state to hold the value of the upload progress
  const [results, setResults] = useState([]);
  const [orderingField, setOrderingField] = useState(
    props.orderingField ? props.orderingField : "created_at"
  );
  const [searchField, setSearchField] = useState("");
  const [limit, setLimit] = useState(10);
  const [endpoint, setEndpoint] = useState(props.endpoint);
  const [nextEndpoint, setNextEndpoint] = useState(null);
  const [previousEndpoint, setPreviousEndpoint] = useState(null);
  const [count, setCount] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFileUploadAlert, setShowFileUploadAlert] = useState(false); //Create a state to hold the value of the alert modal
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const nextPage = () => {
    setEndpoint(nextEndpoint);
  };

  const previousPage = () => {
    setEndpoint(previousEndpoint);
  };

  const handleUpload = () => {
    setIsUploading(true); //Set isUploading to true to show the progress bar
    //Create a function to handle the file upload from the  files array
    const formData = new FormData(); //Create a new FormData object
    files.forEach((file) => {
      formData.append("file", file); //Append each file to the FormData object
    });
    authenticatedMediaInstance
      .post(props.fileUploadEndpoint, formData)
      .then((res) => {
        console.log("res", res);
        setResponseTitle("File Upload Success");
        setResponseMessage("File(s) uploaded successfully");
        setShowFileUploadAlert(true);
        setShowUploadDialog(false);
        setFiles([]); //Clear the files array
      })
      .catch((err) => {
        console.log("err", err);
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "There was an error uploading your file(s). Please ensure that you file has the correct column headers and try again."
        );
        setShowFileUploadAlert(true);
        setShowUploadDialog(false);
        setFiles([]); //Clear the files array
      })
      .finally(() => {
        setIsUploading(false); //Set isUploading to false to hide the progress bar
      });
  };

  const onDrop = (acceptedFiles) => {
    let validFiles = true;

    acceptedFiles.forEach((file) => {
      if (!isValidFileName(file.name)) {
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "One or more of the file names is invalid. File name can only contain numbers, letters, underscores, and dashes. No special characters or spaces."
        );
        setShowFileUploadAlert(true);
        validFiles = false;
        setShowUploadDialog(false);
        return;
      } else if (!isValidFileExtension(file.name, props.acceptedFileTypes)) {
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "One or more of the file types is invalid. Accepted file types: " +
            props.acceptedFileTypes.join(", ")
        );
        setShowFileUploadAlert(true);
        setShowUploadDialog(false);
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
    console.log("updatedFiles", updatedFiles);
    setFiles(updatedFiles);
    setResponseMessage(null);
    setResponseTitle(null);
  };

  useEffect(() => {
    setIsLoading(true);
    if (props.endpoint && endpoint) {
      authenticatedInstance
        .get(endpoint, {
          params: {
            ordering: orderingField,
            search: searchField,
            limit: limit,
            ...props.additionalParams
          },
        })
        .then((res) => {
          if (res.data.results) {
            setResults(res.data.results);
            setCount(res.data.count);
            setNextEndpoint(res.data.next);
            setPreviousEndpoint(res.data.previous);
          } else {
            setResults(res.data);
            setCount(res.data.length);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (props.data) {
      setResults(props.data);
      setCount(props.data.length);
      setIsLoading(false);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [orderingField, searchField, limit, endpoint, props.data]);
  return (
    <div>
      <>
        {props.showUpload && (
          <>
            <ProgressModal open={isUploading} title="Uploading Files" />
            <AlertModal
              title={responseTitle}
              message={responseMessage}
              open={showFileUploadAlert}
              onClick={() => setShowFileUploadAlert(false)}
              btnText="OK"
            />
            <UIDialog
              open={showUploadDialog}
              onClose={() => setShowUploadDialog(false)}
              maxWidth="lg"
              style={{ width: "700px", zIndex: 991 }}
            >
              <UIDropzone
                onDrop={onDrop}
                acceptedFileTypes={props.acceptedFileTypes}
                files={files}
                setFiles={setFiles}
              />
              {props.uploadHelpText && (
                <div style={{ margin: "10px" }}>
                  <HelpOutlineIcon
                    style={{ color: uiGreen, marginRight: "5px" }}
                  />
                  <span style={{ color: uiGrey2, fontSize: "10pt" }}>
                    {props.uploadHelpText}
                  </span>
                </div>
              )}
              {files.length > 0 && (
                <UIButton
                  onClick={handleUpload}
                  btnText="Upload File"
                  style={{ width: "100%" }}
                />
              )}
            </UIDialog>
          </>
        )}
        <div style={{ width: "100%", overflow: "auto" }}>
          <Stack
            direction="row"
            justifyContent={isMobile ? "flex-end" : `space-between`}
            alignItems="center"
          >
            {screenWidth > breakpoints.md && (
              <h4 data-testId="ui-table-mobile-title">
                {props.tableTitle} ({count})
              </h4>
            )}

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              alignItems="center"
              style={{ padding: "10px" }}
            >
              {props.showUpload && (
                <>
                  <ButtonBase
                    data-testid="ui-table-mobile-create-button"
                    style={{ color: uiGreen, float: "right" }}
                    onClick={() => {
                      setShowUploadDialog(true);
                    }}
                  >
                    {props.uploadButtonText ? props.uploadButtonText : "Upload"}
                    <IconButton style={{ color: uiGreen }}>
                      <FileUploadIcon />
                    </IconButton>
                  </ButtonBase>
                </>
              )}

              {props.showCreate && (
                <ButtonBase
                  data-testid="ui-table-mobile-create-button"
                  style={{ color: uiGreen, float: "right" }}
                  onClick={() => {
                    navigate(props.createURL);
                  }}
                >
                  New
                  <IconButton style={{ color: uiGreen }}>
                    <AddIcon />
                  </IconButton>
                </ButtonBase>
              )}
              <>
                {!isMobile && (
                  <input
                    style={{
                      ...defaultWhiteInputStyle,
                      width: "220px",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                    }}
                    type="text"
                    placeholder="Search"
                    onChange={(e) => {
                      setSearchField(e.target.value);
                    }}
                  />
                )}
                {screenWidth > breakpoints.md && (
                  <span style={{ color: "black" }}>Show</span>
                )}
                <select
                  className="limit-select"
                  style={{
                    maxWidth: isMobile ? "75px" : "150px",
                    borderRadius: "5px",
                    border: "none",
                    padding: "5px 10px",
                    backaground: "white",
                    fontSize: isMobile ? "10pt" : "12pt",
                  }}
                  onChange={(e) => {
                    setLimit(e.target.value);
                  }}
                >
                  {isMobile && (
                    <option value="" selected disabled>
                      Show
                    </option>
                  )}
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                {screenWidth > breakpoints.md && (
                  <span style={{ color: "black" }}>Results</span>
                )}
              </>
              <>
                {screenWidth > breakpoints.md && (
                  <span style={{ color: "black" }}>Sort By</span>
                )}
                <select
                  onChange={(e) => {
                    setOrderingField(e.target.value);
                  }}
                  style={{
                    borderRadius: "5px",
                    border: "none",
                    padding: "5px 10px",
                    backaground: "white",
                    fontSize: isMobile ? "10pt" : "12pt",
                    maxWidth: isMobile ? "65px" : "150px",
                  }}
                >
                  {isMobile && (
                    <option selected disabled value="">
                      Sort By
                    </option>
                  )}
                  {props.orderingFields &&
                    props.orderingFields.map((field) => {
                      return <option value={field.field}>{field.label}</option>;
                    })}
                </select>
              </>
            </Stack>
          </Stack>
        </div>
        {isMobile && (
          <input
            style={{
              ...defaultWhiteInputStyle,
              width: "100%",
              border: "none",
              outline: "none",
              marginBottom: "10px",
            }}
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
          />
        )}
        {isLoading ? (
          <UIProgressPrompt
            title={props.loadingTitle ? props.loadingTitle : "Loading..."}
            message={
              props.loadingMessage
                ? props.loadingMessage
                : "Please wait while we fetch your data"
            }
          />
        ) : (
          <div>
            {results.length > 0 ? (
              <div>
                {results.map((row, index) => {
                  return (
                    <UITableMobileCard
                      dataTestId={
                        props.createTestRowIdentifier
                          ? `${props.createTestRowIdentifier(row)}-${index}`
                          : `${props.testRowIdentifier}-${index}`
                      }
                      onClick={
                        props.onRowClick ? () => props.onRowClick(row) : null
                      }
                      cardStyle={{ background: "white", color: "black" }}
                      infoStyle={{ color: uiGrey2, fontSize: "13pt" }}
                      titleStyle={{
                        color: uiGrey2,
                        fontSize: "12pt",
                        marginBottom: "5px",
                        ...props.titleStyle,
                      }}
                      subtitleStyle={{
                        color: uiGrey2,
                        fontSize: "11pt",
                        color: "rgba(133, 135, 150, 0.75)",
                      }}
                      title={
                        props.titleProperty
                          ? row[props.titleProperty]
                          : props.createTitle(row)
                      }
                      info={
                        props.infoProperty
                          ? row[props.infoProperty]
                          : props.createInfo(row)
                      }
                      subtitle={
                        props.subtitleProperty
                          ? row[props.subtitleProperty]
                          : props.createSubtitle(row)
                      }
                      imageSrc={
                        props.getImage
                          ? props.getImage(row)
                          : "https://picsum.photos/200"
                      }
                      showChevron={true}
                    />
                  );
                })}
                <div>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    {previousEndpoint && (
                      <ButtonBase onClick={previousPage}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={0}
                        >
                          <IconButton style={{ color: uiGreen }}>
                            <ArrowBackOutlined />
                          </IconButton>
                          <span style={{ color: uiGreen }}>Prev</span>
                        </Stack>
                      </ButtonBase>
                    )}
                    <span></span>
                    {nextEndpoint && (
                      <ButtonBase onClick={nextPage}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={0}
                        >
                          <span style={{ color: uiGreen }}>Next</span>
                          <IconButton style={{ color: uiGreen }}>
                            <ArrowForwardIcon />
                          </IconButton>
                        </Stack>
                      </ButtonBase>
                    )}
                  </Stack>
                </div>
              </div>
            ) : (
              <UIPrompt
                title="No Results"
                message="No Results are available."
              />
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default UITableMobile;
