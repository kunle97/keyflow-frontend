import React, { useEffect, useState, useRef } from "react";
import { getLandlordStaffMember } from "../../../../api/landlords";
import { useParams } from "react-router";
import useScreen from "../../../../hooks/useScreen";
import UITabs from "../../UIComponents/UITabs";
import {
  Alert,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import UISwitch from "../../UIComponents/UISwitch";
import {
  validateForm,
  triggerValidation,
} from "../../../../helpers/formValidation";
import { uiGreen, validationMessageStyle } from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import Assign from "../LeaseTemplate/CreateLeaseTemplate/Steps/Assign";
import AssignResource from "./AssignResource";
import {
  deleteStaff,
  updateStaffPrivileges,
  updateStaffRole,
} from "../../../../api/staff";
import { el } from "@faker-js/faker";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import DeleteButton from "../../UIComponents/DeleteButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { useNavigate } from "react-router";
import { syncStaffAccountPrivileges } from "../../../../helpers/preferences";
import BackButton from "../../UIComponents/BackButton";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ManageStaff = () => {
  const [staffMember, setStaffMember] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tabPage, setTabPage] = useState(0);
  const [staffPrivileges, setStaffPrivileges] = useState([]);
  const [staffRentalAssignments, setStaffRentalAssignments] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const tabs = [
    { name: "resources_managed", label: "Resources  Managed" },
    { name: "permissions", label: "Permissions" },
  ];
  const anchorRef = useRef(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [openEditRoleDialog, setOpenEditRoleDialog] = useState(false);
  const { isMobile } = useScreen();
  const { id } = useParams();
  const navigate = useNavigate();
  const [checked, setChecked] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [selectedResourceType, setSelectedResourceType] = useState(0);
  const [alertOpen, setAlertOpen] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".manage-staff-section",
      content:
        "This is the staff management section. Here you can view and manage your staff members. You can assign what units or properties they can manage and also set their permissions for what they can do to each unit or property.",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".manage-staff-overview-section",
      content:
        "This is the staff overview section. Here you can view the staff member's name and email.",
    },
    {
      target: ".header-more-button",
      content:
        "Click here to view more options for the staff member such as changing their role or deleting them from your account.",
    },
    {
      target: ".assign-resource-section",
      content:
        "This is where you can assign what unit, property or portfolio the staff member can manage.",
    },
    {
      target: ".resource-filter-select",
      content:
        "Use this to filter between your units, properties or portfolios to assign to the staff member.",
    },
    {
      target: ".ui-table-checkbox-container:first-of-type",
      content:
        "Simply click each checkbox to assign the staff member to the unit, property or portfolio you would like them to manage.",
    },
    {
      target: ".ui-table-search-input",
      content: "Use the search bar to search for a specific resource.",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
    },
    {
      target: ".staff-privileges-section",
      content:
        "This is the staff privileges section. Here you can set the permissions for the staff member.",
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
    console.log(runTour);
  };
  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenPopper(false);
    } else if (event.key === "Escape") {
      setOpenPopper(false);
    }
  };
  // Dropdown
  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenPopper(false);
  };
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };
  const handleChange = (e, formData, setFormData, formInputs, setErrors) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };

  const formInputs = [
    {
      label: "Role",
      name: "role",
      disabled: false,
      colSpan: 12,
      type: "text",
      onChange: (e) =>
        handleChange(e, formData, setFormData, formInputs, setErrors),
      placeholder: "Enter role",
      validations: {
        required: true,
        regex: /^[a-zA-Z\s]*$/,
      },
      dataTestId: "role",
      errorMessageDataTestId: "role_error",
    },
  ];

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const { isValid, newErrors } = validateForm(formData, formInputs);
    setErrors(newErrors);
    if (isValid) {
      console.log("Form Data ", formData);
      updateStaffRole({ role: formData.role, staff_id: id }).then((res) => {
        console.log(res);
        if (res.status) {
          setAlertOpen(true);
          setAlertTitle("Success");
          setAlertMessage("Role updated successfully");
        } else {
          setAlertOpen(true);
          setAlertTitle("Error");
          setAlertMessage("An error occured while updating role");
        }
      });
    } else {
      console.log("Form Data is not valid");
    }
  };

  //Create a function that handle the change of the value of a privilege
  const handlePrivilegeChange = (e, inputType, privilegeName, valueName) => {
    if (inputType === "switch") {
      console.log(e.target.checked);
      let newStaffPrivileges = [];
      console.log("Privilege Name ", privilegeName);
      //Check if the name of the privilege is all_privileges and update all subscrent values in th eother privileges with the same name
      if (privilegeName === "all_permissions") {
        console.log("privelage nameeeee", privilegeName);
        newStaffPrivileges = staffPrivileges.map((privilege) => {
          privilege.values.map((value) => {
            if (value.name === valueName) {
              value.value = e.target.checked;
            }
          });
          return privilege;
        });
      } else {
        //Update the value of the privilege and use setOwnerPrivileges to update the state
        newStaffPrivileges = staffPrivileges.map((privilege) => {
          if (privilege.name === privilegeName) {
            privilege.values.map((value) => {
              if (value.name === valueName) {
                value.value = e.target.checked;
              }
            });
          }
          return privilege;
        });
      }

      console.log("New Staff Privileges ", newStaffPrivileges);
      setStaffPrivileges(newStaffPrivileges);
      let payload = {
        privileges: JSON.stringify(newStaffPrivileges),
        staff_id: id,
      };
      updateStaffPrivileges(payload).then((res) => {
        console.log(res);
      });
    } else {
      console.log(e.target.value);
    }
  };

  useEffect(() => {
    syncStaffAccountPrivileges(id);
    getLandlordStaffMember(id).then((res) => {
      if (!staffMember || !staffPrivileges || !staffRentalAssignments) {
        console.log("Staff Datata", JSON.parse(res.data.rental_assignments));
        setStaffMember(res.data);
        setStaffPrivileges(JSON.parse(res.data.privileges));
        setStaffRentalAssignments(JSON.parse(res.data.rental_assignments));
        //Set the selected assignments to the staff rental assignments
        JSON.parse(res.data.rental_assignments).value.map((assignment) => {
          setSelectedAssignments((prevAssignments) => [
            ...prevAssignments,
            { id: assignment, selected: true },
          ]);
        });
        const assignment_type = JSON.parse(
          res.data.rental_assignments
        ).assignment_type;
        if (assignment_type === "units") {
          setSelectedResourceType(0);
        } else if (assignment_type === "properties") {
          setSelectedResourceType(1);
        } else if (assignment_type === "portfolios") {
          setSelectedResourceType(2);
        }
        setFormData({
          first_name: res.data.user.first_name,
          last_name: res.data.user.last_name,
          email: res.data.user.email,
          role: res.data.role,
        });
      }
    });
  }, []);
  return (
    <>
      <Joyride
        run={runTour}
        index={tourIndex}
        steps={tourSteps}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: uiGreen,
          },
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip",
        }}
      />
      <AlertModal
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        onClick={() => {
          setAlertOpen(false);
        }}
        btnText="Okay"
      />
      <ConfirmModal
        open={showDeleteConfirmModal}
        title="Delete Staff"
        message="Are you sure you want to delete this staff member?"
        confirmBtnText="Delete"
        cancelBtnText="Cancel"
        handleConfirm={() => {
          let payload = { staff_id: id };
          deleteStaff(payload).then((res) => {
            console.log(res);
            if (res.status === 204) {
              navigate("/dashboard/landlord/staff");
            } else {
              navigate("/dashboard/landlord/staff");
            }
          });
          setShowDeleteConfirmModal(false);
        }}
        handleCancel={() => {
          setShowDeleteConfirmModal(false);
        }}
      />
      <UIDialog
        open={openEditRoleDialog}
        onClose={() => {
          setOpenEditRoleDialog(false);
        }}
        title="Edit Staff Member Role"
      >
        <>
          <form onSubmit={handleUpdateSubmit}>
            <div className="row">
              {formInputs.map((input, index) => {
                return (
                  <div className={`col-md-${input.colSpan} mb-3`} key={index}>
                    <div className="form-group">
                      <input
                        type={input.type}
                        disabled={input.disabled}
                        className={`form-control`}
                        name={input.name}
                        value={formData[input.name]}
                        onChange={input.onChange}
                        onBlur={input.onChange}
                        placeholder={input.placeholder}
                      />
                      {errors[input.name] && (
                        <span
                          data-testId={input.errorMessageDataTestId}
                          style={{ ...validationMessageStyle }}
                        >
                          {errors[input.name]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <UIButton
                type="submit"
                className="btn btn-primary"
                btnText="Save"
                onClick={(e) => {
                  handleUpdateSubmit(e);
                }}
              />
            </div>
          </form>
        </>
      </UIDialog>
      {staffMember && (
        <div className="container manage-staff-section">
          <div className="manage-staff-overview-section">
            <BackButton />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <div
                  style={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    width: "50px",
                    height: "50px",
                    margin: "15px",
                  }}
                >
                  <img
                    style={{ height: "100%" }}
                    src={"/assets/img/avatars/default-user-profile-picture.png"}
                  />
                </div>
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <h4 style={{ width: "100%", textAlign: "left" }}>
                    {staffMember.user.first_name} {staffMember.user.last_name}
                  </h4>
                  <div style={{ width: "100%", textAlign: "left" }}>
                    <a
                      href={`mailto:${staffMember.user.email}`}
                      className="text-muted"
                    >
                      {staffMember.user.email}
                    </a>
                  </div>
                </Stack>
              </Stack>
              <div className="header-more-button">
                <IconButton
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={openPopper ? "composition-menu" : undefined}
                  aria-expanded={openPopper ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
              <Popper
                open={openPopper}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                sx={{
                  zIndex: "1",
                }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom-start"
                          ? "right top"
                          : "right top",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={openEditRoleDialog}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem
                            onClick={() => {
                              setOpenEditRoleDialog(true);
                            }}
                          >
                            Change Role
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setShowDeleteConfirmModal(true);
                            }}
                          >
                            Delete Staff Member
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Stack>
          </div>
          <UITabs
            value={tabPage}
            handleChange={handleChangeTabPage}
            tabs={tabs}
            variant="fullWidth"
            scrollButtons="auto"
            ariaLabel=""
            style={{ marginBottom: "20px" }}
          />
          {tabPage === 0 && (
            <div className="assign-resource-section">
              <AssignResource
                checked={checked}
                setChecked={setChecked}
                selectedAssignments={selectedAssignments}
                setSelectedAssignments={setSelectedAssignments}
                selectedResourceType={selectedResourceType}
                setSelectedResourceType={setSelectedResourceType}
                staffId={id}
              />
            </div>
          )}
          {tabPage === 1 && (
            <div className="staff-privileges-section">
              {staffPrivileges &&
                staffPrivileges.length > 0 &&
                staffPrivileges.map((privilege, index) => {
                  return (
                    <div>
                      {privilege.name !== "rental_resources" && (
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
                                  {privilege.label}
                                </Typography>
                              }
                              secondary={
                                <React.Fragment>
                                  {privilege.description}
                                </React.Fragment>
                              }
                            />
                            {privilege.values &&
                              privilege.values.map((value) => {
                                return (
                                  <>
                                    <span className="text-black">
                                      {value.label}
                                    </span>
                                    {value.inputType === "switch" && (
                                      <UISwitch
                                        onChange={(e) =>
                                          handlePrivilegeChange(
                                            e,
                                            value.inputType,
                                            privilege.name,
                                            value.name
                                          )
                                        }
                                        value={value.value}
                                      />
                                    )}
                                  </>
                                );
                              })}
                          </Stack>
                        </ListItem>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </>
  );
};

export default ManageStaff;
