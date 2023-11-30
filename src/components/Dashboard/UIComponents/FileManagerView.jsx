import React, { useEffect, useState } from "react";
import UploadDialog from "./Modals/UploadDialog/UploadDialog";
import UIButton from "./UIButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack } from "@mui/material";
import { extractFileNameAndExtension } from "../../../helpers/utils";
import UIPrompt from "./UIPrompt";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { uiGreen, uiRed } from "../../../constants";
import ConfirmModal from "./Modals/ConfirmModal";
import { deleteFile } from "../../../api/file_uploads";
import AlertModal from "./Modals/AlertModal";
import { useNavigate } from "react-router";
import UIInput from "./UIInput";
import UIDropdown from "./UIDropdown";
const FileManagerView = (props) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedFileToDelete, setSelectedFileToDelete] = useState(null); //Create a state to hold the file to be deleted
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [
    showDeleteConfirmationAlertModal,
    setShowDeleteConfirmationAlertModal,
  ] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // State for items per page
  const navigate = useNavigate();

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when changing the search query
  };

  const filteredFiles = props.files.filter((media) => {
    const { fileName } = extractFileNameAndExtension(media.file);
    return fileName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when changing items per page
  };
  const handleConfirmDelete = () => {
    setIsLoading(true);
    console.log("deleted");
    let payload = {
      id: selectedFileToDelete.id,
      file_key: selectedFileToDelete.file_key,
    };
    deleteFile(payload)
      .then((res) => {
        if (res.status === 200) {
          setResponseTitle("File Delete");
          setResponseMessage("File deleted successfully");
          setShowDeleteConfirmationAlertModal(true);
          setShowDeleteConfirmation(false);
          setSelectedFileToDelete(null);
        } else {
          setResponseTitle("File Delete Error");
          setResponseMessage("Something went wrong");
          setShowDeleteConfirmationAlertModal(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="row">
      <div className="col-md-12">
        <UploadDialog
          open={uploadDialogOpen}
          setOpen={setUploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          subfolder={props.subfolder}
          acceptedFileTypes={props.acceptedFileTypes}
        />
      </div>
      <div className="col-md-12">
        <ConfirmModal
          open={showDeleteConfirmation}
          setOpen={setShowDeleteConfirmation}
          handleClose={() => setShowDeleteConfirmation(false)}
          handleCancel={() => {
            setShowDeleteConfirmation(false);
            setSelectedFileToDelete(null);
          }}
          cancelBtnText={"Cancel"}
          cancelBtnStyle={{ backgroundColor: uiGreen }}
          title={"Delete File"}
          message={"Are you sure you want to delete this file?"}
          handleConfirm={handleConfirmDelete}
          confirmBtnText={"Delete"}
          confirmBtnStyle={{ backgroundColor: uiRed }}
        />
      </div>
      <div className="col-md-12">
        <AlertModal
          open={showDeleteConfirmationAlertModal}
          setOpen={setShowDeleteConfirmationAlertModal}
          title={responseTitle}
          message={responseMessage}
          onClick={() => {
            setShowDeleteConfirmationAlertModal(false);
            setResponseTitle(null);
            setResponseMessage(null);
            navigate(0);
          }}
          btnText={"Okay"}
        />
      </div>
      <div className="col-md-12 mt-1" style={{ overflow: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          style={{ marginBottom: "20px" }}
        >
          <h2>{filteredFiles.length} Results</h2>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            <UIDropdown
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              options={[1, 2, 3, 6, 12, 18, 24]}
              prefixText={"Show "}
              suffixText={" Items"}
            />
            <UIInput
              placeholder={"Search..."}
              value={searchQuery}
              onChange={handleSearchInputChange} // Connect the input to the search handler
              style={{ width: "160px" }}
            />
            <UIButton
              btnText={"Upload File"}
              onClick={() => setUploadDialogOpen(true)}
              style={{ width: "110px" }}
            />
          </Stack>
        </Stack>
        <div className="row">
          {currentItems.length > 0 ? (
            <>
              {currentItems.map((media, index) => {
                const { fileName, extension } = extractFileNameAndExtension(
                  media.file
                );
                const full_file_name = `${fileName}${extension}`;
                return (
                  <div
                    key={index}
                    className="col-md-3"
                    style={{ padding: 0 }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div
                      className="image-container"
                      style={{
                        width: "100%",
                        height: "300px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={media.file}
                        alt="media"
                        style={{ height: "100%" }}
                      />
                      {hoverIndex === index && (
                        <div
                          className="image-overlay"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.75)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            padding: "0 10px",
                          }}
                        >
                          <span style={{ color: "white" }}>
                            {full_file_name}
                          </span>
                          <IconButton
                            onClick={() => {
                              console.log("delete", media);
                              setShowDeleteConfirmation(true);
                              setSelectedFileToDelete(media);
                            }}
                          >
                            <DeleteIcon style={{ color: "white" }} />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <UIPrompt
              title={
                props.files.length === 0
                  ? "No Media Uploaded"
                  : "No Results Found"
              }
              icon={
                <FileCopyIcon
                  style={{
                    width: "50px",
                    height: "50px",
                    color: uiGreen,
                  }}
                />
              }
              message={
                props.files.length === 0
                  ? "You have not uploaded any media for this resource. Click the button below to upload media."
                  : "No results Found for this search query."
              }
              body={
                props.files.length === 0 ? (
                  <UIButton
                    btnText={"Upload Media"}
                    onClick={() => {
                      setUploadDialogOpen(true);
                    }}
                  />
                ) : null
              }
            />
          )}
        </div>
        {/* Pagination Buttons */}
        {props.files.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <UIButton
              btnText="Previous"
              onClick={prevPage}
              disabled={currentPage === 1}
            />
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of{" "}
              {Math.ceil(filteredFiles.length / itemsPerPage)}
            </span>
            <UIButton
              btnText="Next"
              onClick={nextPage}
              disabled={indexOfLastItem >= filteredFiles.length}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManagerView;