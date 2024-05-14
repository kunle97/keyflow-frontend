import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Stack } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { uiGreen, validationMessageStyle } from "../../../../constants";
import {
  getBillingEntry,
  updateBillingEntry,
  deleteBillingEntry,
} from "../../../../api/billing-entries";
import DeleteButton from "../../UIComponents/DeleteButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const ManageBillingEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [confirmModelOpen, setConfirmModelOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [cancelAction, setCancelAction] = useState(() => () => {});
  const [isExpense, setIsExpense] = useState(false);
  const [errors, setErrors] = useState({});

  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const tourSteps = [
    {
      target: ".manage-billing-entry-form",
      content: "This page is used to manage and update billing entries.",
      disableBeacon: true,
    },
    {
      target: ".update-billing-entry-wrapper",
      content: "Click this button to update the billing entry.",
    },
    {
      target: ".delete-billing-entry-wrapper",
      content: "Click this button to delete the billing entry.",
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

  const formInputs = [
    {
      id: 1,
      label: "Amount",
      type: "text_display",
      placeholder: "Enter amount",
      name: "amount",
      step: "0.01",
      hide: false,
      dataTestId: "amount-text-display",
      validations: {
        required: false,
        errorMessage: "",
        regex: null,
      },
    },
    {
      id: 2,
      label: "Tenant",
      type: "text_display",
      customRender: (tenant) => {
        return `${tenant.user.first_name} ${tenant.user.last_name}`;
      },
      name: "tenant",
      hide: isExpense,
      dataTestId: "tenant-text-display",
      validations: {
        required: false,
        errorMessage: "",
        regex: null,
      },
    },
    {
      id: 3,
      label: "Rental Unit",
      name: "rental_unit",
      type: "text_display",
      customRender: (unit) => {
        console.log("unit cusotm renedsedr", unit);
        return unit
          ? "Unit " + unit.name + " (" + unit.rental_property_name + ")"
          : "";
      },
      hide: !isExpense,
      dataTestId: "unit-text-display",
      validations: {
        required: false,
        errorMessage: "",
        regex: null,
      },
    },
    {
      id: 4,
      label: "Type",
      type: "text_display",
      customRender: (type) => {
        return removeUnderscoresAndCapitalize(type);
      },
      name: "type",
      validations: {
        required: true,
        errorMessage: "Type cannot be blank",
        regex: null,
      },
      hide: false,
      onChange: (e) => {
        if (
          e.target.value === "expense" ||
          e.target.value === "vendor_payment"
        ) {
          setIsExpense(true);
          //Set collection_method and due_date to null in form data
          setFormData((prevData) => ({
            ...prevData,
            collection_method: null,
            due_date: null,
          }));
        } else {
          setIsExpense(false);
        }
        handleChange(e);
      },
      dataTestId: "type-text-display",
      validations: {
        required: false,
        errorMessage: "Type cannot be blank",
        regex: null,
      },
    },
    {
      id: 7,
      label: isExpense ? "Transaction Date" : "Due Date",
      type: "text_display",
      name: "due_date",
      customRender: (date) => {
        return date ? new Date(date).toLocaleDateString() : "";
      },
      hide: false,
      validations: {
        required: true,
        errorMessage: "Due date cannot be blank",
        regex: /^\d{4}-\d{2}-\d{2}$/,
      },
      dataTestId: "due-date-text-display",
      validations: {
        required: false,
        errorMessage: "Due date cannot be blank",
        regex: null,
      },
    },
    {
      id: 5,
      label: "Status",
      type: "select",
      name: "status",
      options: [
        { value: "unpaid", text: "Unpaid" },
        { value: "paid", text: "Paid" },
      ],
      hide: false,
      onChange: (e) => {
        setIsLoading(true);
        setCancelAction(() => () => {
          //Reset status to previous value
          setFormData((prevData) => ({
            ...prevData,
            status: e.target.value === "unpaid" ? "paid" : "unpaid",
          }));
        });
        // Check if status is being changed to paid
        if (e.target.value === "paid") {
          setConfirmTitle("Mark as Paid");
          setConfirmMessage(
            "Are you sure you want to mark this billing entry as paid? The invoice will be marked as paid and finalized. This action cannot be undone."
          );
          setConfirmModelOpen(true);
          setConfirmAction(() => () => {
            handleChange(e);
          });
          handleChange(e);
        }
        //Check if status is being changed from paid to unpaid
        else if (e.target.value === "unpaid") {
          setAlertTitle("Cannot Mark as Unpaid");
          setAlertMessage(
            "This billing entry has already been marked as paid. It cannot be marked as unpaid."
          );
          setAlertOpen(true);
        }
        console.log(formData);
        setIsLoading(false);
      },
      validations: {
        required: true,
        errorMessage: "Please specify the status of the billing entry.",
        regex: null,
      },
      dataTestId: "status-select",
      errorMessageDataTestId: "status-error-message",
    },
    {
      id: 8,
      label: "Description",
      type: "textarea",
      name: "description",
      placeholder: "Enter description",
      hide: false,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: "A description is required for the billing entry.",
        regex: null,
      },
      dataTestId: "description-textarea",
      errorMessageDataTestId: "description-error-message",
    },
  ];
  const labelStyles = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "black",
    display: "block",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, newErrors } = validateForm(formData, formInputs);
    setErrors(newErrors);
    if (isValid) {
      setIsLoading(true);
      setLoadingText("Updating billing entry...");
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      updateBillingEntry(id, formData)
        .then((res) => {
          if (res.id) {
            setAlertTitle("Success");
            setAlertMessage("Billing entry updated successfully");
          } else {
            setAlertTitle("Error");
            let message = res.data.message ? res.data.message : "";
            setAlertMessage(
              `There was an error updating the billing entry. ${message}`
            );
          }
        })
        .catch((err) => {
          setAlertTitle("Error");
          setAlertMessage("There was an error updating the billing entry.");
        })
        .finally(() => {
          setAlertOpen(true);
          setIsLoading(false);
        });
    } else {
      setAlertTitle("Error Submitting Form");
      setAlertMessage("Please fix the form errors before submitting.");
      setAlertOpen(true);
    }
  };

  const handleDelete = () => {
    setIsLoading(true);
    setLoadingText("Deleting billing entry...");
    deleteBillingEntry(id)
      .then((res) => {
        if (res.status === 204) {
          navigate("/dashboard/owner/billing-entries");
        } else {
          setAlertTitle("Error");
          setAlertMessage("There was an error deleting the billing entry.");
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        console.error("Delete billing entry error ", err);
        setAlertTitle("Error");
        setAlertMessage("There was an error deleting the billing entry.");
        setAlertOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    setLoadingText("Fetching billing entry...");
    getBillingEntry(id)
      .then((res) => {
        if (res) {
          setFormData(res.data);
          setSelectedTenant(res.data.tenant ? res.data.tenant : null);
          setSelectedUnit(res.data.unit ? res.data.unit : null);
          setIsExpense(
            res.data.type === "expense" || res.data.type === "vendor_payment"
          );
        }
      })
      .catch((err) => {
        setAlertTitle("Error");
        setAlertMessage("There was an error fetching the billing entry.");
        setAlertOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="container-fluid">
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
      <ProgressModal open={isLoading} title={loadingText} />
      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        btnText={"Ok"}
        onClick={() => {
          setAlertOpen(false);
        }}
      />
      <ConfirmModal
        open={confirmModelOpen}
        title={confirmTitle}
        message={confirmMessage}
        cancelBtnText="Cancel"
        confirmBtnText="Confirm"
        handleConfirm={(e) => {
          confirmAction(e);
          setConfirmAction(null);
          setConfirmModelOpen(false);
        }}
        handleCancel={() => {
          cancelAction();
          setConfirmModelOpen(false);
        }}
      />

      <h4 className="">Manage Billing Entry</h4>
      {formData && (
        <div className="card manage-billing-entry-form">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {formInputs.map((input) => {
                  if (input.hide) {
                    return null;
                  }
                  if (
                    input.type === "text_display" &&
                    formData[input.name] !== null
                  ) {
                    return (
                      <div className="col-md-6 mb-3" key={input.id}>
                        <label style={{ ...labelStyles }}>{input.label}</label>
                        <span
                          className="text-black"
                          data-testid={input.dataTestId}
                        >
                          {input.customRender
                            ? input.customRender(formData[input.name])
                            : formData[input.name]}
                        </span>
                      </div>
                    );
                  }
                  if (
                    input.type === "select" &&
                    formData[input.name] !== null
                  ) {
                    return (
                      <div className="col-md-6 mb-3" key={input.id}>
                        <label style={{ ...labelStyles }}>{input.label}</label>
                        <select
                          onChange={input.onChange}
                          className="form-select"
                          name={input.name}
                          style={{ margin: "10px 0" }}
                          value={formData ? formData[input.name] : ""}
                          data-testid={input.dataTestId}
                        >
                          <option value={""} selected disabled>
                            Select One
                          </option>
                          {input.options.map((option) => {
                            return (
                              <option key={option.value} value={option.value}>
                                {option.text}
                              </option>
                            );
                          })}
                        </select>
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{
                              ...validationMessageStyle,
                              display: "block",
                            }}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    );
                  }
                  if (
                    input.type === "textarea" &&
                    formData[input.name] !== null
                  ) {
                    return (
                      <div className="col-md-12" key={input.id}>
                        <label style={{ ...labelStyles }}>{input.label}</label>
                        <textarea
                          onChange={input.onChange}
                          className="form-control"
                          placeholder={input.placeholder}
                          style={{ margin: "10px 0" }}
                          name={input.name}
                          rows={5}
                          defaultValue={formData ? formData[input.name] : ""}
                          data-testid={input.dataTestId}
                        ></textarea>
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{
                              ...validationMessageStyle,
                              display: "block",
                            }}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                style={{ margin: "20px 0" }}
              >
                <span className="delete-billing-entry-wrapper">
                  <DeleteButton
                    style={{ float: "left" }}
                    onClick={() => {
                      setConfirmTitle("Delete Billing Entry");
                      setConfirmMessage(
                        "Are you sure you want to delete this billing entry? The invoice will be voided and the billing entry will be deleted. This action cannot be undone."
                      );
                      setConfirmAction(() => handleDelete);
                      setConfirmModelOpen(true);
                    }}
                    btnText="Delete Billing Entry"
                  />
                </span>
                <span className="update-billing-entry-wrapper">
                  <UIButton
                    type="submit"
                    className="btn btn-primary"
                    btnText="Update Billing Entry"
                    style={{ float: "right" }}
                    dataTestId="update-billing-entry-button"
                  />
                </span>
              </Stack>
            </form>
          </div>
        </div>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default ManageBillingEntry;
