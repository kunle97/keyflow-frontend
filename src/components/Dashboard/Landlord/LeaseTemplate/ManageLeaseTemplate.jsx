import { Button, Input, Tooltip, Typography } from "@mui/material";
import React from "react";
import {
  uiGreen,
  uiGrey2,
  uiRed,
  validationMessageStyle,
} from "../../../../constants";
import { set, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useEffect } from "react";
import { authenticatedInstance } from "../../../../api/api";
import { useState } from "react";
import { HelpOutline } from "@mui/icons-material";
import UITabs from "../../UIComponents/UITabs";
import BackButton from "../../UIComponents/BackButton";
import UIButton from "../../UIComponents/UIButton";
import UITable from "../../UIComponents/UITable/UITable";
import { getUnit } from "../../../../api/units";
import { useNavigate } from "react-router";
import { createBoldSignEmbeddedTemplateEditLink } from "../../../../api/boldsign";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIPrompt from "../../UIComponents/UIPrompt";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import UIInput from "../../UIComponents/UIInput";
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
const ManageLeaseTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaseTemplate, setLeaseTemplate] = useState({});
  const [units, setUnits] = useState([]);
  //TODO: Tabs for lease terms: Details, Additional Charges, Units Assigned, View (BoldSign) Document,
  const [tabPage, setTabPage] = useState(0);
  const tabs = [
    { name: "details", label: "Details" },
    { name: "additionalCharges", label: "Additional Charges" },
    { name: "unitsAssigned", label: "Units Assigned" },
    { name: "editDocument", label: "Edit Document" },
  ];
  const { isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [progressModalTitle, setProgressModalTitle] = useState("");
  const [alertModalIsOpen, setAlertModalIsOpen] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [chargesValid, setChargesValid] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState(null);
  const [editLink, setEditLink] = useState("");
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-template-management-page",
      content:
        "This is the lease template management page where you can make changes to your lease agreement template by updating the lease term, adding additional charges, assigning the lease agreement to units, properties, or portfolios, and editing the lease agreement document.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".add-terms-container",
      content:
        "Here you can add terms to your lease agreement template. You can set the rent amount, rent frequency, term, late fee, security deposit, and other terms.",
    },
    {
      target: ".additional-charges-section",
      content:
        "Here you can add additional charges to your lease agreement template. You can set the name, amount, and frequency of the additional charges. An example of an additional charge is monthly pet rent.",
    },
    {
      target: ".assign-to-units-section",
      content:
        "Here you can assign the lease agreement template to units, properties, or portfolios. You can assign the lease agreement to multiple units, properties, or portfolios.",
    },
    {
      target: ".edit-lease-template-document",
      content:
        "Here you can edit the lease agreement document. You can update the lease agreement terms, add signature fields, and send the lease agreement for signature.",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setTourIndex(0);
      setRunTour(false);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setTourIndex(nextStepIndex);
    }

    console.log("Current Joyride data", data);
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    if (tabPage === 0) {
      setTourIndex(0);
    } else if (tabPage === 1) {
      setTourIndex(2);
    } else if (tabPage === 2) {
      setTourIndex(3);
    } else if (tabPage === 3) {
      setTourIndex(4);
    } else if (tabPage === 4) {
      setTourIndex(5);
    }
    setRunTour(true);
    console.log(runTour);
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

  const [detailsErrors, setDetailsErrors] = useState({});
  const [detailsFormData, setDetailsFormData] = useState({});
  const detailsFormInputs = [
    {
      name: "rent",
      label: "Rent",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+(?:\.[0-9]{1,2})?$/,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "rent",
      errorMessageDataTestId: "rent-error",
    },
    {
      name: "rent_frequency",
      label: "Rent Frequency",
      type: "select",
      colSpan: 6,
      options: [
        { value: "", label: "Select One" },
        { value: "day", label: "Daily" },
        { value: "week", label: "Weekly" },
        { value: "month", label: "Monthly" },
        { value: "year", label: "Yearly" },
      ],
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[A-Za-z]+$/i,
        errorMessage: "This field is required",
      },
      dataTestId: "rent-frequency",
      errorMessageDataTestId: "rent-frequency-error",
    },
    {
      name: "term",
      label: "Term",
      type: "term",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+$/i,
        errorMessage: "This field is required",
      },
      dataTestId: "term",
      errorMessageDataTestId: "term-error",
    },
    {
      name: "late_fee",
      label: "Late Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+(?:\.[0-9]{1,2})?$/,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "late-fee",
      errorMessageDataTestId: "late-fee-error",
    },
    {
      name: "security_deposit",
      label: "Security Deposit",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+(?:\.[0-9]{1,2})?$/,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "security-deposit",
      errorMessageDataTestId: "security-deposit-error",
    },
    {
      name: "gas_included",
      label: "Gas Included",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[A-Za-z]+$/,
        errorMessage: "This field is required",
      },
      dataTestId: "gas-included",
      errorMessageDataTestId: "gas-included-error",
    },
    {
      name: "water_included",
      label: "Water Included",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[A-Za-z]+$/,
        errorMessage: "This field is required",
      },
      dataTestId: "water-included",
      errorMessageDataTestId: "water-included-error",
    },
    {
      name: "electric_included",
      label: "Electric Included",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[A-Za-z]+$/,
        errorMessage: "This field is required",
      },
      dataTestId: "electric-included",
      errorMessageDataTestId: "electric-included-error",
    },
    {
      name: "repairs_included",
      label: "Repairs Included",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[A-Za-z]+$/,
        errorMessage: "This field is required",
      },
      dataTestId: "repairs-included",
      errorMessageDataTestId: "repairs-included-error",
    },
    {
      name: "grace_period",
      label: "Grace Period",
      type: "text",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+$/,
        errorMessage: "This field is required",
      },
      dataTestId: "grace-period",
      errorMessageDataTestId: "grace-period-error",
    },

    {
      name: "lease_cancellation_notice_period",
      label: "Lease Cancellation Notice Period",
      type: "text",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+$/,
        errorMessage: "This field is required",
      },
      dataTestId: "lease-cancellation-notice-period",
      errorMessageDataTestId: "lease-cancellation-notice-period-error",
    },
    {
      name: "lease_cancellation_fee",
      label: "Lease Cancellation Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+(?:\.[0-9]{1,2})?$/,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "lease-cancellation-fee",
      errorMessageDataTestId: "lease-cancellation-fee-error",
    },
    {
      name: "lease_renewal_notice_period",
      label: "Lease Renewal Notice Period",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+$/,
        errorMessage: "This field is required",
      },
      dataTestId: "lease-renewal-notice-period",
      errorMessageDataTestId: "lease-renewal-notice-period-error",
    },
    {
      name: "lease_renewal_fee",
      label: "Lease Renewal Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: /^[0-9]+(?:\.[0-9]{1,2})?$/,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "lease-renewal-fee",
      errorMessageDataTestId: "lease-renewal-fee-error",
    },
  ];

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  //Additional Charges Functinos
  const addCharge = () => {
    setAdditionalCharges((prevCharges) => [
      ...prevCharges,
      {
        name: "",
        amount: "",
        frequency: "",
      },
    ]);
  };
  const removeCharge = (index) => {
    if (additionalCharges.length === 1) return;
    let newCharges = [...additionalCharges];
    newCharges.splice(index, 1);
    setAdditionalCharges(newCharges);
  };

  const saveAdditionalCharges = async () => {
    //TODO: CHeck for validation errors
    await authenticatedInstance
      .patch(`/lease-templates/${id}/`, {
        additional_charges: JSON.stringify(additionalCharges),
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setAlertModalIsOpen(true);
          setAlertModalTitle("Success");
          setAlertModalMessage("Additional charges updated successfully.");
        } else {
          setAlertModalIsOpen(true);
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong. Please try again.");
        }
      });
  };

  //Assignment  Functions & Variables
  const handleRowClick = (rowData, rowMeta) => {
    getUnit(rowData).then((res) => {
      console.log(res);
      const navlink = `/dashboard/landlord/units/${res.id}/${res.rental_property}`;
      navigate(navlink);
    });
    console.log(rowData);
  };

  const onSubmit = async (data) => {
    await authenticatedInstance
      .patch(`/lease-templates/${id}/`, detailsFormData)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setAlertModalIsOpen(true);
          setAlertModalTitle("Success");
          setAlertModalMessage("Lease term updated successfully.");
        } else {
          setAlertModalIsOpen(true);
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong. Please try again.");
        }
      });
  };
  const retrieveLeaseTemplateData = async () => {
    setIsLoading(true);
    setProgressModalTitle("Retrieving Lease Template Information...");
    authenticatedInstance
      .get(`/lease-templates/${id}/`)
      .then((res) => {
        console.log(res.data.additional_charges);
        setLeaseTemplate(res.data);
        setDetailsFormData({
          rent: res.data.rent,
          rent_frequency: res.data.rent_frequency,
          term: res.data.term,
          late_fee: res.data.late_fee,
          security_deposit: res.data.security_deposit,
          gas_included: res.data.gas_included,
          water_included: res.data.water_included,
          electric_included: res.data.electric_included,
          repairs_included: res.data.repairs_included,
          grace_period: res.data.grace_period,
          lease_cancellation_notice_period:
            res.data.lease_cancellation_notice_period,
          lease_cancellation_fee: res.data.lease_cancellation_fee,
          lease_renewal_notice_period: res.data.lease_renewal_notice_period,
          lease_renewal_fee: res.data.lease_renewal_fee,
        });
        setAdditionalCharges(JSON.parse(res.data.additional_charges));
        setUnits(res.data.units);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const retrieveEditLink = async () => {
    setIsLoading(true);
    setProgressModalTitle("Retrieving Lease Document...");
    createBoldSignEmbeddedTemplateEditLink({
      template_id: leaseTemplate.template_id,
    })
      .then((res) => {
        console.log(res);
        setEditLink(res.url);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleChangeTabPage = (event, newValue) => {
    if (newValue === 0) {
      retrieveLeaseTemplateData();
    } else if (newValue === 3) {
      retrieveEditLink();
    }
    setTabPage(newValue);
  };

  const additionalChargesForm = () => {
    return (
      <>
        {additionalCharges.map((charge, index) => (
          <div key={index} className="row mt-3">
            <div className="col-md-3">
              <label className="form-label text-black" htmlFor="street">
                <strong>Charge</strong>
              </label>
              <input
                {...register(`additionalChargeName_${index}`, {
                  required: {
                    value: true,
                    message: "Charge name is required",
                  },
                })}
                type="text"
                value={charge.name}
                onChange={(e) => {
                  trigger(`additionalChargeName_${index}`);
                  let newCharges = [...additionalCharges];
                  newCharges[index].name = e.target.value;
                  setAdditionalCharges(newCharges);
                }}
                className="form-control"
              />
              <span style={validationMessageStyle}>
                {errors[`additionalChargeName_${index}`] &&
                  errors[`additionalChargeName_${index}`]?.message}
              </span>
            </div>
            <div className="col-md-3">
              <label className="form-label text-black" htmlFor="street">
                <strong>Amount</strong>
              </label>
              <input
                {...register(`additionalChargeAmount_${index}`, {
                  required: {
                    value: true,
                    message: "Charge amount is required",
                  },
                })}
                type="number"
                value={charge.amount}
                onChange={(e) => {
                  trigger(`additionalChargeAmount_${index}`);
                  let newCharges = [...additionalCharges];
                  newCharges[index].amount = e.target.value;
                  setAdditionalCharges(newCharges);
                }}
                className="form-control"
              />
              <span style={validationMessageStyle}>
                {errors[`additionalChargeAmount_${index}`] &&
                  errors[`additionalChargeAmount_${index}`]?.message}
              </span>
            </div>
            <div className="col-md-3">
              <label className="form-label text-black" htmlFor="street">
                <strong>Frequency</strong>
              </label>
              <select
                {...register(`additionalChargeFrequency_${index}`, {
                  required: {
                    value: true,
                    message: "Charge frequency is required",
                  },
                })}
                onChange={(e) => {
                  trigger(`additionalChargeFrequency_${index}`);
                  let newCharges = [...additionalCharges];
                  newCharges[index].frequency = e.target.value;
                  setAdditionalCharges(newCharges);
                }}
                value={charge.frequency}
                className="form-control"
              >
                <option value="">Select Frequency</option>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
              <span style={validationMessageStyle}>
                {errors[`additionalChargeFrequency_${index}`] &&
                  errors[`additionalChargeFrequency_${index}`]?.message}
              </span>
            </div>
            {charge.index !== 0 && (
              <div className="col-md-3">
                <UIButton
                  onClick={() => removeCharge(index)}
                  btnText="Remove"
                  variant="text"
                  style={{
                    marginTop: "30px",
                    color: uiRed,
                    backgroundColor: "transparent",
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>
        ))}
        <UIButton
          onClick={() => {
            //TODO: Trigger validation
            trigger([
              `additionalChargeName_${additionalCharges.length - 1}`,
              `additionalChargeAmount_${additionalCharges.length - 1}`,
              `additionalChargeFrequency_${additionalCharges.length - 1}`,
            ]);
            if (
              (errors[`additionalChargeName_${additionalCharges.length - 1}`] ||
                errors[
                  `additionalChargeAmount_${additionalCharges.length - 1}`
                ] ||
                errors[
                  `additionalChargeFrequency_${additionalCharges.length - 1}`
                ]) &&
              !chargesValid
            ) {
              setChargesValid(false);
              return;
            } else {
              addCharge();
            }
          }}
          btnText="Add Charge"
          style={{
            marginTop: "20px",
            display: "block",
            boxShadow: "none",
          }}
        />
        <UIButton
          btnText="Update Charges"
          onClick={saveAdditionalCharges}
          style={{ marginTop: "20px", float: "right" }}
        />
      </>
    );
  };

  useEffect(() => {
    retrieveLeaseTemplateData();
  }, []);
  return (
    <div className="container lease-template-management-page">
      <Joyride
        run={runTour}
        stepIndex={tourIndex}
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
      <ProgressModal open={isLoading} title={progressModalTitle} />
      <AlertModal
        open={alertModalIsOpen}
        title={alertModalTitle}
        message={alertModalMessage}
        onClick={() => setAlertModalIsOpen(false)}
        btnText="Okay"
      />
      <BackButton />
      <UITabs
        style={{ marginBottom: "2rem" }}
        tabs={tabs}
        value={tabPage}
        handleChange={handleChangeTabPage}
        scrollable={true}
      />
      {tabPage === 0 && (
        <div className="card add-terms-container">
          <div className="card-body" style={{ overflow: "auto" }}>
            <form className="row">
              {detailsFormInputs.map((input, index) => (
                <div
                  className={`form-group col-md-${input.colSpan} mb-4`}
                  key={index}
                >
                  <Typography
                    className="mb-2"
                    sx={{ color: uiGrey2, fontSize: "12pt" }}
                    htmlFor={input.name}
                  >
                    {input.label}
                  </Typography>
                  {input.type === "select" ? (
                    <select
                      id={input.name}
                      name={input.name}
                      value={detailsFormData[input.name]}
                      onChange={input.onChange}
                      onBlur={input.onChange}
                      className="form-control"
                    >
                      {input.options.map((option, i) => (
                        <option key={i} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={input.name}
                      name={input.name}
                      type={input.type}
                      value={detailsFormData[input.name]}
                      onChange={input.onChange}
                      onBlur={input.onChange}
                      className="form-control"
                    />
                  )}
                  {detailsErrors[input.name] && (
                    <span style={validationMessageStyle}>
                      {detailsErrors[input.name]}
                    </span>
                  )}
                </div>
              ))}
              <div className="form-group col-md-12">
                <UIButton
                  onClick={() => {
                    const { isValid, newErrors } = validateForm(
                      detailsFormData,
                      detailsFormInputs
                    );
                    if (isValid) {
                      onSubmit();
                    } else {
                      setDetailsErrors(newErrors);
                    }
                  }}
                  btnText="Update"
                  style={{ float: "right" }}
                />
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Additional Charges */}
      {tabPage === 1 && (
        <>
          <div className="card additional-charges-section">
            <div className="card-body">{additionalChargesForm()}</div>
          </div>
        </>
      )}
      {tabPage === 2 && (
        <div className="assign-to-units-section">
          <UITableMobile
            data={units}
            infoProperty="name"
            createTitle={(row) =>
              `Occupied: ${row.is_occupied ? `Yes` : "No"} `
            }
            createSubtitle={(row) => `Beds: ${row.beds} | Baths: ${row.baths}`}
            // createURL={`/dashboard/landlord/lease-templates/units/create/${id}`}
            // showCreate={true}
            // getImage={(row) => {
            //   retrieveFilesBySubfolder(
            //     `properties/${property.id}/units/${row.id}`,
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
              const navlink = `/dashboard/landlord/units/${row.id}/${row.rental_property}`;
              navigate(navlink);
            }}
          />
        </div>
      )}
      {tabPage === 3 && (
        <>
          <div className="card edit-lease-template-document">
            <iframe
              src={editLink}
              height={isMobile ? "500px" : "1200px"}
              width="100%"
            />
          </div>
        </>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default ManageLeaseTemplate;
