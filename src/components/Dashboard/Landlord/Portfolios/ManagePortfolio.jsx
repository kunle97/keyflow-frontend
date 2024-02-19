import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import UITabs from "../../UIComponents/UITabs";
import {
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../../../../api/portfolios";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack } from "@mui/material";
import {
  authUser,
  uiGreen,
  uiGrey,
  defaultWhiteInputStyle,
  validationMessageStyle,
  uiRed,
} from "../../../../constants";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import { set, useForm } from "react-hook-form";
import UIButton from "../../UIComponents/UIButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import useScreen from "../../../../hooks/useScreen";
import DeleteButton from "../../UIComponents/DeleteButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import UIPreferenceRow from "../../UIComponents/UIPreferenceRow";
import UITable from "../../UIComponents/UITable/UITable";
const ManagePortfolio = () => {
  const { id } = useParams();
  const { isMobile } = useScreen();
  const navigate = useNavigate();
  const { screenWidth, breakpoints } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState({});
  const [properties, setProperties] = useState(null);
  const [open, setOpen] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [tabPage, setTabPage] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const tabs = [{ label: "Properties " }, { label: "Preferences" }];
  const [checked, setChecked] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const columns = [
    { label: "Name", name: "name" },
    { label: "Street", name: "street" },
    { label: "City", name: "city" },
    { label: "State", name: "state" },
    { label: "Zip Code", name: "zip_code" },
    { label: "Country", name: "country" },
  ];

  const options = {
    isSelectable: false,
    onRowClick: (row) => {
      let navlink = "/";
      navlink = `/dashboard/landlord/properties/${row}`;
      navigate(navlink);
    },
  };
  const onSubmit = (data) => {
    console.log(data);
    data.owner = authUser.owner_id;
    updatePortfolio(id, data).then((res) => {
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        setAlertTitle("Success");
        setAlertMessage("Portfolio updated successfully");
        setOpen(true);
        setEditDialogOpen(false);
      } else {
        setAlertTitle("Error");
        setAlertMessage("Error updating portfolio");
        setOpen(true);
        setEditDialogOpen(false);
      }
    });
  };

  const handleDelete = () => {
    deletePortfolio(id).then((res) => {
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        setAlertTitle("Portfolio Deleted");
        setAlertMessage("");
        setOpen(true);
        setEditDialogOpen(false);
      } else {
        setAlertTitle("Error");
        setAlertMessage("Error Deleting Portfolio");
        setOpen(true);
        setEditDialogOpen(false);
      }
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabPage(newValue);
  };

  useEffect(() => {
    setIsLoading(true);
    if (!properties || !portfolio) {
      getPortfolio(id)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setPortfolio(res.data);
            setProperties(res.data.rental_properties);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [portfolio, properties]);
  return (
    <div className={`${screenWidth > breakpoints.md && "container-fluid"}`}>
      {isLoading && !portfolio ? (
        <>
          <UIProgressPrompt
            open={isLoading}
            title={"Loading Portfolio..."}
            message={"Please wait while we load your portfolio."}
          />
        </>
      ) : (
        <div>
          <AlertModal
            open={open}
            setOpen={setOpen}
            title={alertTitle}
            message={alertMessage}
            btnText={"Ok"}
            onClick={() => setOpen(false)}
          />
          {/* Property Detail Edit Dialog  */}
          <UIDialog
            dataTestId={"edit-portfolio-dialog"}
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="md"
            title="Edit Property Details"
          >
            <div className="row" style={{ width: "500px" }}>
              <div className="col-md-12">
                <div className=" mb-3">
                  <div className="card-body">
                    <form
                      data-dataTestId="edit-portfolio-form"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="form-group mb-4">
                        <label
                          className="text-black"
                          htmlFor="name"
                          data-testid="edit-portfolio-name-label"
                        >
                          Name
                        </label>
                        <input
                          data-testid="edit-portfolio-name-input"
                          style={{
                            ...defaultWhiteInputStyle,
                            background: uiGrey,
                          }}
                          type="text"
                          id="name"
                          defaultValue={portfolio.name}
                          {...register("name", { required: true })}
                        />
                        <span style={validationMessageStyle}>
                          {errors.name && (
                            <span style={validationMessageStyle}>
                              This field is required
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="form-group mb-4">
                        <label
                          className="text-black"
                          htmlFor="description"
                          data-testid="edit-portfolio-description-label"
                        >
                          Description
                        </label>
                        <textarea
                          data-testid="edit-portfolio-description-textarea"
                          style={{
                            ...defaultWhiteInputStyle,
                            background: uiGrey,
                          }}
                          type="text"
                          id="description"
                          defaultValue={portfolio.description}
                          {...register("description", { required: true })}
                        ></textarea>
                      </div>
                      <div className="text-end mb-3">
                        <UIButton
                          dataTestId="edit-portfolio-submit-button"
                          className="btn btn-primary btn-sm ui-btn"
                          type="submit"
                          btnText="Save Changes"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </UIDialog>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginBottom: "25px" }}
          >
            <div>
              <h3 className="text-black" data-testid="portfolio-name">
                {portfolio.name}
              </h3>
              <p className="text-black" data-testid="portfolio-description">
                {portfolio.description}
              </p>
            </div>
            <IconButton
              data-testid="edit-portfolio-button"
              onClick={() => {
                setEditDialogOpen(true);
              }}
            >
              <EditIcon sx={{ color: uiGreen }} />
            </IconButton>
          </Stack>
          <UITabs
            value={tabPage}
            handleChange={handleTabChange}
            tabs={tabs}
            ariaLabel="portfolio tabs"
            style={{ marginBottom: "25px" }}
          />
          {tabPage === 0 && (
            <div>
              {isMobile ? (
                <UITableMobile
                  testRowIdentifier="portfolio-property"
                  tableTitle="Properties"
                  data={properties}
                  infoProperty="name"
                  createTitle={(row) =>
                    `${row.street}, ${row.city}, ${row.state}`
                  }
                  subtitleProperty="something"
                  acceptedFileTypes={[".csv"]}
                  // getImage={(row) => {
                  //   retrieveFilesBySubfolder(
                  //     `properties/${row.id}`,
                  //     authUser.id
                  //   ).then((res) => {
                  //     if (res.data.length > 0) {
                  //       return res.data[0].file;
                  //     } else {
                  //       return "https://picsum.photos/200";
                  //     }
                  //   });
                  // }}
                  onRowClick={(row) => {
                    const navlink = `/dashboard/landlord/properties/${row.id}`;
                    navigate(navlink);
                  }}
                  createURL="/dashboard/landlord/properties/create"
                  showCreate={true}
                />
              ) : (
                <UITable
                  
                  data={properties}
                  searchFields={[
                    "name",
                    "street",
                    "city",
                    "state",
                    "zip_code",
                    "country",
                  ]}
                  menuOptions={[
                    {
                      name: "Manage",
                      onClick: (row) => {
                        const navlink = `/dashboard/landlord/properties/${row.id}`;
                        navigate(navlink);
                      },
                    },
                  ]}
                  title="Properties"
                  showCreate={true}
                  createURL="/dashboard/landlord/properties/create"
                  options={options}
                  checked={checked}
                  columns={columns}
                  setChecked={setChecked}
                />
              )}
            </div>
          )}

          {tabPage === 1 && (
            <div>
              <ConfirmModal
                open={showDeleteConfirmModal}
                setOpen={setShowDeleteConfirmModal}
                title={"Delete Portfolio"}
                message={"Are you sure you want to delete this portfolio?"}
                handleCancel={() => setShowDeleteConfirmModal(false)}
                handleConfirm={handleDelete}
                confirmBtnStyle={{
                  backgroundColor: uiRed,
                  color: "white",
                }}
                cancelBtnStyle={{
                  backgroundColor: uiGreen,
                  color: "white",
                }}
                confirmBtnText={"Delete"}
                cancelBtnText={"Cancel"}
              />
              <UIPreferenceRow
                title="Auto-Collect Rent"
                description="Automatically collect rent from tenants on the first of the month."
                onChange={() => {
                  console.log("Changed Preference");
                }}
              />

              <DeleteButton
                onClick={() => setShowDeleteConfirmModal(true)}
                btnText="Delete Portfolio"
                style={{ float: "right" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagePortfolio;
