import React, { useEffect, useState } from "react";
import {
  getLeaseTemplatesByUser,
  getLeaseTemplateById,
} from "../../../../api/lease_templates";
import { deleteUnit, getUnit, updateUnit } from "../../../../api/units";
import { getUserData } from "../../../../api/auth";
import { getUserStripeSubscriptions } from "../../../../api/auth";
import { Link, useParams } from "react-router-dom";
import BackButton from "../../UIComponents/BackButton";
import {
  Alert,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Stack,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { authUser, token, uiGreen, uiRed } from "../../../../constants";
import { uiGrey2 } from "../../../../constants";
import { modalStyle } from "../../../../constants";
import { CloseOutlined } from "@mui/icons-material";
import { set, useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import DeleteButton from "../../UIComponents/DeleteButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIButton from "../../UIComponents/UIButton";
import UITabs from "../../UIComponents/UITabs";
import FileManagerView from "../../UIComponents/FileManagerView";
import { authenticatedInstance } from "../../../../api/api";
import EditIcon from "@mui/icons-material/Edit";
import { retrieveFilesBySubfolder } from "../../../../api/file_uploads";
import UIPrompt from "../../UIComponents/UIPrompt";
import useScreen from "../../../../hooks/useScreen";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import { getLandlordTenant } from "../../../../api/landlords";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import HomeIcon from "@mui/icons-material/Home";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
const CreateUnit = () => {
  //Create a state for the form data
  const {isMobile } = useScreen();
  const [unit, setUnit] = useState({});
  const [tenant, setTenant] = useState({});
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState(
    "Unit updated successfully"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const { unit_id, property_id } = useParams();
  const [isOccupied, setIsOccupied] = useState(true);
  const [leaseTemplates, setLeaseTemplates] = useState([]);
  const [currentLeaseTemplate, setCurrentLeaseTemplate] = useState(null);
  const [showLeaseTemplateSelector, setShowLeaseTemplateSelector] =
    useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
  const [tabPage, setTabPage] = useState(0);
  const [unitMedia, setunitMedia] = useState([]);
  const [unitMediaCount, setunitMediaCount] = useState(0);
  const [rentalApplications, setRentalApplications] = useState([]);
  const tabs = [
    { label: "Unit", name: "unit" },
    { label: "Lease Template", name: "lease_templates" },
    { label: `Files (${unitMediaCount})`, name: "files" },
    { label: "Rental Applications", name: "rental_applications" },
  ];
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: unit.name,
      beds: unit.beds,
      baths: unit.baths,
      rental_property: property_id,
    },
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowUpdateSuccess(false);
  };

  const retrieveSubscriptionPlan = async () => {
    const res = await getUserStripeSubscriptions(authUser.user_id, token).then(
      (res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      }
    );
    return res;
  };

  //Create a function to handle the form submission to update unit information
  const onSubmit = async (data) => {
    console.log(data);
    const res = await updateUnit(unit_id, data);
    if (res.id) {
      setShowUpdateSuccess(true);
      setAlertSeverity("success");
      setResponseMessage("Unit updated");
    } else {
      setShowUpdateSuccess(true);
      setAlertSeverity("error");
      setResponseMessage("Something went wrong");
    }
  };

  const handleChangeLeaseTemplate = (id) => {
    //set Current Lease Term
    setCurrentLeaseTemplate(leaseTemplates.find((term) => term.id === id));
    //Update the unit with the new lease term with the api
    updateUnit(unit_id, { lease_template: id }).then((res) => {
      console.log(res);
    });
    //Close the lease term selector
    setShowLeaseTemplateSelector(false);
  };

  //Create a function to handle the deletion of a unit
  const handleDeleteUnit = () => {
    //Check if unit is occupied
    if (isOccupied) {
      //Show an error message in the alert modal
      setShowDeleteAlert(false);
      setShowDeleteError(true);
      setDeleteErrorMessage(
        "This unit is occupied. Please remove the tenant before deleting this unit."
      );
      return false;
    } else {
      let payload = {
        unit_id: unit_id,
        rental_property: property_id,
        product_id: currentSubscriptionPlan.plan.product,
        subscription_id: currentSubscriptionPlan.id,
      };
      //Delete the unit with the api
      deleteUnit(payload).then((res) => {
        console.log(res);
      });
      //Redirect to the property page
      navigate(`/dashboard/landlord/properties/${property_id}`);
    }
  };
  const createLeaseTemplateButton = (
    <Link to="/dashboard/landlord/lease-templates/create">
      {" "}
      <Button
        sx={{
          textTransform: "none",
          background: uiGreen,
          color: "white",
        }}
      >
        Create Lease Template
      </Button>
    </Link>
  );

  useEffect(() => {
    //Retrieve Unit Information
    getUnit(unit_id).then((res) => {
      setUnit(res);
      console.log("Unit ", res);
      if (res.is_occupied) {
        getLandlordTenant(res.id).then((tenant_res) => {
          console.log("Tenant", tenant_res.data);
          setTenant(tenant_res.data);
        });
      }
      const preloadedData = {
        name: res.name,
        beds: res.beds,
        baths: res.baths,
        rental_property: property_id,
      };
      // Set the preloaded data in the form using setValue
      Object.keys(preloadedData).forEach((key) => {
        setValue(key, preloadedData[key]);
      });
      setIsOccupied(res.is_occupied);

      if (res.lease_template) {
        getLeaseTemplateById(res.lease_template).then((res) => {
          console.log("Lease Template", res);
          setCurrentLeaseTemplate(res);
        });
      }
    });
    //retrieve lease terms that the user has created
    getLeaseTemplatesByUser().then((res) => {
      setLeaseTemplates(res.data);
    });
    retrieveSubscriptionPlan();
    retrieveFilesBySubfolder(
      `properties/${property_id}/units/${unit_id}`,
      authUser.user_id
    )
      .then((res) => {
        setunitMedia(res.data);
        setunitMediaCount(res.data.length);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    authenticatedInstance
      .get(`/units/${unit_id}/rental-applications/`)
      .then((res) => {
        console.log("Untius Rental APps", res);
        setRentalApplications(res.data);
      });
  }, []);
  return (
    <>
      {isLoading ? (
        <UIProgressPrompt
          title="Loading Unit"
          message="Please wait while we load the unit information for you."
        />
      ) : (
        <div className="container">
          <UIDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            title="Edit Unit"
          >
            <div className=" ">
              <div className="mb-3">
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row mb-3">
                      <div className="col-md-12 mb-3">
                        <label className="form-label text-black" htmlFor="name">
                          <strong>Unit #/Name</strong>
                        </label>
                        <input
                          {...register("name", {
                            required: "This is a required field",
                          })}
                          // defaultValue={unit.name}
                          className="form-control text-black"
                          type="text"
                          id="name"
                          placeholder="5B"
                          style={{
                            borderStyle: "none",
                            color: "rgb(255,255,255)",
                          }}
                        />
                        <span style={validationMessageStyle}>
                          {errors.name && errors.name.message}
                        </span>
                      </div>
                      <div className="col-md-12">
                        <div>
                          <label className="form-label text-black">
                            <strong>Beds</strong>
                          </label>
                          <input
                            {...register("beds", {
                              required: "This is a required field",
                            })}
                            className="form-control text-black"
                            type="number"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                            defaultValue={unit.beds}
                            min="1"
                            step="1"
                          />
                          <span style={validationMessageStyle}>
                            {errors.beds && errors.beds.message}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div>
                          <label className="form-label text-black">
                            <strong>Baths</strong>
                          </label>
                          <input
                            {...register("baths", {
                              required: "This is a required field",
                            })}
                            className="form-control text-black "
                            type="number"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                            defaultValue={unit.baths}
                            min="1"
                            step="1"
                          />
                          <span style={validationMessageStyle}>
                            {errors.baths && errors.baths.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-end my-3">
                      <button className="btn btn-primary ui-btn" type="submit">
                        Update Unit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <>
                <AlertModal
                  open={showDeleteError}
                  setOpen={setShowDeleteError}
                  title={"Error"}
                  message={deleteErrorMessage}
                  btnText={"Ok"}
                  onClick={() => setShowDeleteError(false)}
                />
                <DeleteButton
                  style={{
                    background: uiRed,
                    textTransform: "none",
                    float: "right",
                  }}
                  variant="contained"
                  btnText="Delete Unit"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setShowDeleteAlert(true);
                  }}
                />
                <ConfirmModal
                  open={showDeleteAlert}
                  title="Delete Unit"
                  message="Are you sure you want to delete this unit?"
                  confirmBtnText="Delete"
                  cancelBtnText="Cancel"
                  confirmBtnStyle={{
                    backgroundColor: uiRed,
                    color: "white",
                  }}
                  cancelBtnStyle={{
                    backgroundColor: uiGreen,
                    color: "white",
                  }}
                  handleCancel={() => {
                    setShowDeleteAlert(false);
                  }}
                  handleConfirm={handleDeleteUnit}
                />
              </>
            </div>
          </UIDialog>
          {unitMedia && unitMedia.length > 0 && (
            <div
              style={{
                width: "100%",
                height: isMobile ? "200px" : "320px",
                //Vertical center the image
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <img
                src={unitMedia[0].file}
                style={{
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
          <div className="p-2">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <div>
                <h4>{unit?.name}</h4>
                <span className="text-black">
                  {isOccupied ? (
                    <>
                      <Link
                        to={`/dashboard/landlord/tenants/${tenant?.user?.id}`}
                      >
                        {"Tenant: " +
                          tenant?.user?.first_name +
                          " " +
                          tenant?.user?.last_name}
                      </Link>
                    </>
                  ) : (
                    "Vacant"
                  )}
                </span>
                <br />
                <span className="text-black">{unit?.rental_property_name}</span>
              </div>
              <IconButton
                onClick={() => {
                  setEditDialogOpen(true);
                }}
              >
                <EditIcon sx={{ color: uiGreen }} />
              </IconButton>
            </Stack>
          </div>
          <BackButton />
          <UITabs
            tabs={tabs}
            value={tabPage}
            handleChange={handleChangeTabPage}
            variant="scrollable"
            style={{ margin: "1rem 0" }}
          />
          <div className="row mb-3">
            {tabPage === 0 && (
              <>
                {!isOccupied && unit.lease_template && (
                  <div className="col-md-3">
                    <h5 className="mb-2">Rental Application Link</h5>
                    <div className="card shadow mb-3">
                      <div className="card-body">
                        <input
                          className="form-control"
                          value={`${process.env.REACT_APP_HOSTNAME}/rental-application/${unit_id}/${authUser.user_id}/`}
                        />
                        <a
                          href={`${process.env.REACT_APP_HOSTNAME}/rental-application/${unit_id}/${authUser.user_id}/`}
                          target="_blank"
                        >
                          <Button
                            style={{
                              background: uiGreen,
                              color: "white",
                              textTransform: "none",
                              marginTop: "1rem",
                              width: "100%",
                            }}
                          >
                            Preview
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-sm-12 col-md-12 col-lg-8 ">
                  <div className="row">
                    <div className="col-6 col-md-4 mb-3">
                      <div className="card shadow mb-3">
                        <div className="card-body">
                          <div>
                            <HomeIcon
                              sx={{
                                fontSize: "22pt",
                                color: uiGreen,
                                marginBottom: "10px",
                              }}
                            />
                          </div>
                          <h4>Name</h4>
                          <span
                            className="text-black"
                            style={{
                              fontSize:
                                isMobile ? "12pt" : "15pt",
                            }}
                          >
                            {unit.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 mb-3">
                      <div className="card shadow mb-3">
                        <div className="card-body">
                          <div>
                            <HotelIcon
                              sx={{
                                fontSize: "22pt",
                                color: uiGreen,
                                marginBottom: "10px",
                              }}
                            />
                          </div>
                          <h4>Bed</h4>
                          <span
                            className="text-black"
                            style={{
                              fontSize:
                                isMobile ? "12pt" : "15pt",
                            }}
                          >
                            {unit.beds}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 mb-3">
                      <div className="card shadow mb-3">
                        <div className="card-body">
                          <div>
                            <BathtubIcon
                              sx={{
                                fontSize: "22pt",
                                color: uiGreen,
                                marginBottom: "10px",
                              }}
                            />
                          </div>
                          <h4>Baths</h4>
                          <span
                            className="text-black"
                            style={{
                              fontSize:
                                isMobile ? "12pt" : "15pt",
                            }}
                          >
                            {unit.baths}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <>
                    <AlertModal
                      open={showDeleteError}
                      setOpen={setShowDeleteError}
                      title={"Error"}
                      message={deleteErrorMessage}
                      btnText={"Ok"}
                      onClick={() => setShowDeleteError(false)}
                    />
                    <ConfirmModal
                      open={showDeleteAlert}
                      title="Delete Unit"
                      message="Are you sure you want to delete this unit?"
                      confirmBtnText="Delete"
                      cancelBtnText="Cancel"
                      confirmBtnStyle={{
                        backgroundColor: uiRed,
                        color: "white",
                      }}
                      cancelBtnStyle={{
                        backgroundColor: uiGreen,
                        color: "white",
                      }}
                      handleCancel={() => {
                        setShowDeleteAlert(false);
                      }}
                      handleConfirm={handleDeleteUnit}
                    />
                  </>
                </div>
                <div className="col-md-12"></div>
              </>
            )}
            {tabPage === 1 && (
              <>
                <div className="py-3" style={{ overflow: "auto" }}>
                  <div style={{ float: "right" }}>
                    {createLeaseTemplateButton}
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <div className="mb-3">
                      <div>
                        <Modal open={showLeaseTemplateSelector}>
                          <div
                            className="card"
                            style={{
                              ...modalStyle,
                              width: isMobile ? "90%" : "450px",
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                setShowLeaseTemplateSelector(false)
                              }
                              sx={{
                                width: "50px",
                                height: "50px",
                                color: uiGrey2,
                                padding: "0",
                              }}
                            >
                              <CloseOutlined />
                            </IconButton>
                            <List
                              sx={{
                                width: "100%",
                                maxWidth: "100%",
                                maxHeight: 500,
                                overflow: "auto",
                                color: uiGrey2,
                                bgcolor: "white",
                              }}
                            >
                              {console.log(leaseTemplates === 0)}
                              {leaseTemplates.map((leaseTemplate, index) => {
                                if (leaseTemplates.length == 0) {
                                  return (
                                    <>
                                      <ListItem alignItems="flex-start">
                                        {/* <UIPrompt
                                    title="No Lease Templates Found"
                                    message="You have not created any lease templates. Please create a lease template before assigning it to a unit. Click the button below to create a lease template."
                                    body={createLeaseTemplateButton}
                                    /> */}
                                        <ListItemText
                                          primary={`No lease templates found`}
                                        />
                                      </ListItem>
                                    </>
                                  );
                                } else {
                                  return (
                                    <>
                                      <ListItem alignItems="flex-start">
                                        <ListItemText
                                          primary={`${leaseTemplate.term} Month Lease @ $${leaseTemplate.rent}/mo`}
                                          secondary={
                                            <div>
                                              <h6 style={{ fontSize: "10pt" }}>
                                                Security Deposit: ${" "}
                                                {leaseTemplate.security_deposit}{" "}
                                                | Late Fee: $
                                                {leaseTemplate.late_fee} | Grace
                                                Period:{" "}
                                                {leaseTemplate.grace_period ===
                                                0 ? (
                                                  "None"
                                                ) : (
                                                  <>{`${leaseTemplate.grace_period} Month(s)`}</>
                                                )}
                                              </h6>
                                              <div style={{ overflow: "auto" }}>
                                                <div
                                                  style={{
                                                    color: uiGrey2,
                                                    float: "left",
                                                  }}
                                                >
                                                  <p className="m-0">
                                                    Gas{" "}
                                                    {leaseTemplate.gas_included
                                                      ? "included"
                                                      : "not included"}
                                                  </p>
                                                  <p className="m-0">
                                                    Electric{" "}
                                                    {leaseTemplate.electric_included
                                                      ? "included"
                                                      : "not included"}
                                                  </p>
                                                  <p className="m-0">
                                                    Water{" "}
                                                    {leaseTemplate.water_included
                                                      ? "included"
                                                      : "not included"}
                                                  </p>
                                                </div>

                                                <Button
                                                  onClick={() =>
                                                    handleChangeLeaseTemplate(
                                                      leaseTemplate.id
                                                    )
                                                  }
                                                  sx={{
                                                    background: uiGreen,
                                                    color: "white",
                                                    textTransform: "none",
                                                    float: "right",
                                                    marginTop: "10px",
                                                  }}
                                                  variant="container"
                                                  className="ui-btn"
                                                >
                                                  Select
                                                </Button>
                                              </div>
                                              {/* <p
                                              style={{
                                                color: uiGrey2,
                                                width: "100%",
                                              }}
                                            >
                                              Template ID:{" "}
                                              {leaseTemplate.template_id
                                                ? leaseTemplate.template_id
                                                : "N/A"}
                                            </p> */}
                                            </div>
                                          }
                                        />
                                      </ListItem>
                                      <Divider component="li" />
                                    </>
                                  );
                                }
                              })}
                            </List>
                          </div>
                        </Modal>
                      </div>
                    </div>
                    <div className="row">
                      {currentLeaseTemplate ? (
                        <>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Rent</h6>${currentLeaseTemplate.rent}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Term</h6>
                            {currentLeaseTemplate.term} Months
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Late Fee</h6>
                            {`$${currentLeaseTemplate.late_fee}`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Security Deposit</h6>
                            {`$${currentLeaseTemplate.security_deposit}`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Gas Included?</h6>
                            {`${
                              currentLeaseTemplate.gas_included ? "Yes" : "No"
                            }`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Electric Included?</h6>
                            {`${
                              currentLeaseTemplate.electric_included
                                ? "Yes"
                                : "No"
                            }`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Water Included?</h6>
                            {`${
                              currentLeaseTemplate.water_included ? "Yes" : "No"
                            }`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Lease Cancellation Fee</h6>
                            {`$${currentLeaseTemplate.lease_cancellation_fee}`}
                          </div>
                          <div className="col-md-4 mb-4">
                            <h6>Lease Cancellation Notice period</h6>
                            {`${currentLeaseTemplate.lease_cancellation_notice_period} Month(s)`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Grace period</h6>
                            {currentLeaseTemplate.grace_period === 0 ? (
                              "None"
                            ) : (
                              <>{`${currentLeaseTemplate.grace_period} Month(s)`}</>
                            )}
                          </div>
                          {!isOccupied && (
                            <UIButton
                              sx={{
                                textTransform: "none",
                                background: uiGreen,
                                color: "white",
                                marginTop: "1rem",
                              }}
                              onClick={() => setShowLeaseTemplateSelector(true)}
                              btnText="Assign Lease Template"
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <UIPrompt
                            title="No Lease Template Assigned"
                            message="You have not assigned a lease template to this unit. Click the button below to assign a lease template."
                            hideBoxShadow={true}
                            body={
                              <>
                                {!isOccupied && (
                                  <UIButton
                                    sx={{
                                      textTransform: "none",
                                      background: uiGreen,
                                      color: "white",
                                      marginTop: "1rem",
                                    }}
                                    onClick={() =>
                                      setShowLeaseTemplateSelector(true)
                                    }
                                    btnText="Assign Lease Template"
                                  />
                                )}
                              </>
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {tabPage === 2 && (
              <>
                <div className="col-md-12">
                  <FileManagerView
                    files={unitMedia}
                    subfolder={`properties/${property_id}/units/${unit_id}`}
                    acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
                  />
                </div>
              </>
            )}
            {tabPage === 3 && (
              <UITableMobile
                data={rentalApplications}
                tableTitle={"Rental Applications"}
                // endpoint={`/units/${unit_id}/rental-applications/`}
                createInfo={(row) => `${row.first_name} ${row.last_name}`}
                createTitle={(row) => `${row.unit.name}`}
                createSubtitle={(row) =>
                  `${row.is_approved ? "Approved" : "Pending"}`
                }
                // getImage={(row) => {
                //   retrieveFilesBySubfolder(
                //     `properties/${row.id}`,
                //     authUser.user_id
                //   ).then((res) => {
                //     if (res.data.length > 0) {
                //       return res.data[0].file;
                //     } else {
                //       return "https://picsum.photos/200";
                //     }
                //   });
                // }}
                onRowClick={(row) => {
                  const navlink = `/dashboard/landlord/rental-applications/${row.id}`;
                  navigate(navlink);
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUnit;
