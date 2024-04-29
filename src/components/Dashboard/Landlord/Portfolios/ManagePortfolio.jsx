import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import UITabs from "../../UIComponents/UITabs";
import {
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
  updatePortfolioPreferences,
} from "../../../../api/portfolios";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, ListItem, ListItemText, Stack, Typography } from "@mui/material";
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
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import UISwitch from "../../UIComponents/UISwitch";
import { syncPortfolioPreferences } from "../../../../helpers/preferences";
const ManagePortfolio = () => {
  const { id } = useParams();
  const { isMobile } = useScreen();
  const navigate = useNavigate();
  const { screenWidth, breakpoints } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioPreferences, setPortfolioPreferences] = useState([]);
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [tabPage, setTabPage] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const tabs = [{ label: "Properties " }, { label: "Preferences" }];
  const [checked, setChecked] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // name: portfolio ? portfolio.name : "",
    // description: portfolio ? portfolio.description : "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };

  const formInputs = [
    {
      name: "name",
      label: "Name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Portfolio Name",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please enter a valid name for the portfolio",
      },
      dataTestId: "portfolio-name",
      errorMessageDataTestId: "portfolio-name-error",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Portfolio Description",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please enter a valid description for the portfolio",
      },
      dataTestId: "portfolio-description",
      errorMessageDataTestId: "portfolio-description-error",
    },
  ];

  const {
    register,
    handleSubmit,
    // formState: { errors },
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
  const onSubmit = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      owner: authUser.owner_id,
    };
    updatePortfolio(id, payload).then((res) => {
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

  //Create a function that handle the change of the value of a preference
  const handlePreferenceChange = (e, inputType, preferenceName) => {
    if (inputType === "switch") {
      //Update the unit preferences state to be the opposite of the current value
      setPortfolioPreferences((prevPreferences) => {
        const updatedPreferences = prevPreferences.map((preference) =>
          preference.name === preferenceName
            ? { ...preference, value: e.target.checked }
            : preference
        );
        //Update tProperty preferences with the api
        updatePortfolioPreferences(id, { preferences: JSON.stringify(updatedPreferences) });
        return updatedPreferences;
      });
    } else {
    }
  };

  useEffect(() => {
    setIsLoading(true);
    syncPortfolioPreferences(id);
    if (!properties || !portfolio) {
      getPortfolio(id)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setPortfolio(res.data);
            setProperties(res.data.rental_properties);
            setPortfolioPreferences(JSON.parse(res.data.preferences));
            console.log(JSON.parse(res.data.preferences))
            setFormData({
              name: res.data.name,
              description: res.data.description,
            });
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
                      {formInputs.map((input, index) => {
                        return (
                          <div
                            className={`col-md-${input.colSpan} mb-3`}
                            key={index}
                            data-testId={`${input.dataTestId}`}
                          >
                            <label
                              className="form-label text-black"
                              htmlFor={input.name}
                            >
                              {input.label}
                            </label>
                            {input.type === "textarea" ? (
                              <textarea
                                style={{
                                  ...defaultWhiteInputStyle,
                                  background: uiGrey,
                                }}
                                type={input.type}
                                name={input.name}
                                onChange={input.onChange}
                                onBlur={input.onChange}

                                // {...register(input.name, { required: true })}
                              >
                                {formData[input.name]}
                              </textarea>
                            ) : (
                              <input
                                style={{
                                  ...defaultWhiteInputStyle,
                                  background: uiGrey,
                                }}
                                type={input.type}
                                name={input.name}
                                onChange={input.onChange}
                                onBlur={input.onChange}
                                defaultValue={formData[input.name]}
                                // {...register(input.name, { required: true })}
                              />
                            )}
                            {errors[input.name] && (
                              <span
                                data-testId={input.errorMessageDataTestId}
                                style={{ ...validationMessageStyle }}
                              >
                                {errors[input.name]}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      <div className="text-end mb-3">
                        <UIButton
                          dataTestId="edit-portfolio-submit-button"
                          className="btn btn-primary btn-sm ui-btn"
                          onClick={() => {
                            const { isValid, newErrors } = validateForm(
                              formData,
                              formInputs
                            );
                            if (isValid) {
                              setIsLoading(true);
                              onSubmit();
                            } else {
                              setErrors(newErrors);
                            }
                          }}
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
                {portfolio ? portfolio.name : ""}
              </h3>
              <p className="text-black" data-testid="portfolio-description">
                {portfolio ? portfolio.description : ""}
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
            <>
              {portfolioPreferences &&
                portfolioPreferences.map((preference, index) => {
                  return (
                    <ListItem
                      style={{
                        borderRadius: "10px",
                        background: "white",
                        margin: "10px 0",
                        boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ width: "100%" }}
                      >
                        <ListItemText
                          primary={
                            <Typography sx={{ color: "black" }}>
                              {preference.label}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              {preference.description}
                            </React.Fragment>
                          }
                        />
                        <>
                          {preference.inputType === "switch" && (
                            <UISwitch
                              onChange={(e) => {
                                handlePreferenceChange(
                                  e,
                                  preference.inputType,
                                  preference.name
                                );
                              }}
                              value={preference.value}
                            />
                          )}
                        </>
                      </Stack>
                    </ListItem>
                  );
                })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagePortfolio;
