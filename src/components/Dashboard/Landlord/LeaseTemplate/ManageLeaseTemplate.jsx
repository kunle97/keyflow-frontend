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
  const [isLoading, setIsLoading] = useState(false);
  const [progressModalTitle, setProgressModalTitle] = useState("");
  const [alertModalIsOpen, setAlertModalIsOpen] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [chargesValid, setChargesValid] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState(null);
  const [editLink, setEditLink] = useState("");
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
    console.log(additionalCharges);
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
  const columns = [
    { name: "name", label: "Name" },
    { name: "beds", label: "Beds" },
    { name: "baths", label: "Baths" },
    {
      name: "is_occupied",
      label: "Occupied",
      options: {
        customBodyRender: (value) => {
          if (value === true) {
            return <span>Yes</span>;
          } else {
            return <span>No</span>;
          }
        },
      },
    },
  ];
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: handleRowClick,
  };
  const onSubmit = async (data) => {
    console.log("Lease Term Data", data);
    await authenticatedInstance
      .patch(`/lease-templates/${id}/`, data)
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
        setLeaseTemplate(res.data);
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
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
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
    <div className="container">
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
      />
      {tabPage === 0 && (
        <div className="card">
          <div className="card-body" style={{ overflow: "auto" }}>
            <form className="row" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group col-md-6 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="rent"
                >
                  Rent (Dollar Amount)
                </Typography>
                <input
                  {...register("rent", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("rent");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      rent: e.target.value,
                    });
                  }}
                  value={leaseTemplate.rent}
                  type="number"
                  className="form-control"
                  id="rent"
                  placeholder="$"
                  name="rent"
                />
                <span style={validationMessageStyle}>
                  {errors.rent && errors.rent.message}
                </span>
              </div>
              <div className="form-group col-md-6 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="rent"
                >
                  Term Duration
                </Typography>
                <select
                  {...register("term", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("term");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      term: e.target.value,
                    });
                  }}
                  value={leaseTemplate.term}
                  className="form-select"
                  sx={{ width: "100%", color: uiGrey2, background: uiGrey2 }}
                  name="term"
                >
                  <option value="">Select One</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={13}>13 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
                <span style={validationMessageStyle}>
                  {errors.term && errors.term.message}
                </span>
              </div>

              <div className="form-group col-md-6 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="lateFee"
                >
                  Late Fee
                </Typography>
                <input
                  {...register("late_fee", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("late_fee");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      late_fee: e.target.value,
                    });
                  }}
                  value={leaseTemplate.late_fee}
                  type="number"
                  className="form-control"
                  id="lateFee"
                  placeholder="$"
                  name="late_fee"
                />
                <span style={validationMessageStyle}>
                  {errors.late_fee && errors.late_fee.message}
                </span>
              </div>
              <div className="form-group col-md-6 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="rent"
                >
                  Security Deposit (Dollar Amount)
                </Typography>
                <input
                  {...register("security_deposit", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("security_deposit");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      security_deposit: e.target.value,
                    });
                  }}
                  value={leaseTemplate.security_deposit}
                  type="number"
                  className="form-control"
                  id="security_deposit"
                  placeholder="$"
                />
                <span style={validationMessageStyle}>
                  {errors.security_deposit && errors.security_deposit.message}
                </span>
              </div>

              <div className="form-group col-md-6 mb-4">
                <label className="mb-2 text-black">Gas Included</label>
                <select
                  {...register("gas_included", {
                    required: "This field is required",
                  })}
                  onChange={(e) => {
                    // trigger("gas_included");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      gas_included: e.target.value,
                    });
                  }}
                  value={leaseTemplate.gas_included}
                  name="gas_included"
                  className="form-control"
                >
                  <option value="">Select One</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <span style={validationMessageStyle}>
                  {errors.gas_included && errors.gas_included.message}
                </span>
              </div>

              <div className="form-group col-md-6 mb-4">
                <label className="mb-2 text-black">Water Included</label>
                <select
                  {...register("water_included", {
                    required: "This field is required",
                  })}
                  onChange={(e) => {
                    setLeaseTemplate({
                      ...leaseTemplate,
                      water_included: e.target.value,
                    });
                  }}
                  className="form-control"
                  defaultValue={leaseTemplate.water_included}
                  value={leaseTemplate.water_included}
                >
                  <option value="">Select One</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <span style={validationMessageStyle}>
                  {errors.water_included && errors.water_included.message}
                </span>
              </div>
              <div className="form-group col-md-6 mb-4">
                <label className="mb-2 text-black">Electric Included</label>
                <select
                  {...register("electric_included", {
                    required: "This field is required",
                  })}
                  onChange={(e) => {
                    setLeaseTemplate({
                      ...leaseTemplate,
                      electric_included: e.target.value,
                    });
                  }}
                  value={leaseTemplate.electric_included}
                  className="form-control"
                >
                  <option value="">Select One</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <span style={validationMessageStyle}>
                  {errors.electric_included && errors.electric_included.message}
                </span>
              </div>
              <div className="form-group col-md-6 mb-4">
                <label className="mb-2 text-black">Repairs Included</label>
                <select
                  {...register("repairs_included", {
                    required: "This field is required",
                  })}
                  onChange={(e) => {
                    setLeaseTemplate({
                      ...leaseTemplate,
                      repairs_included: e.target.value,
                    });
                  }}
                  value={leaseTemplate.repairs_included}
                  className="form-control"
                >
                  <option value="">Select One</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <span style={validationMessageStyle}>
                  {errors.repairs_included && errors.repairs_included.message}
                </span>
              </div>
              <div className="form-group col-md-12 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="rent"
                >
                  Grace Period
                  <Tooltip title="The grace period is the amount of time you give a tenant until they mus pay for thier first rent payment.">
                    <HelpOutline
                      sx={{
                        marginLeft: "5px",
                        width: "20px",
                      }}
                    />
                  </Tooltip>
                </Typography>
                <select
                  {...register("grace_period", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("grace_period");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      grace_period: e.target.value,
                    });
                  }}
                  value={leaseTemplate.grace_period}
                  className="form-select"
                  sx={{ width: "100%", color: uiGrey2 }}
                >
                  <option value="">Select One</option>
                  <option value={0} selected>
                    None
                  </option>
                  <option value={1}>1 Months</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                  <option value={4}>4 Months</option>
                  <option value={5}>5 Months</option>
                </select>
                <span style={validationMessageStyle}>
                  {errors.lease_cancellation_notice_period &&
                    errors.lease_cancellation_notice_period.message}
                </span>
              </div>
              <div className="form-group col-sm-12 col-md-6 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="rent"
                >
                  Lease Cancellation Notice Period
                </Typography>
                <select
                  {...register("lease_cancellation_notice_period", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("lease_cancellation_notice_period");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      lease_cancellation_notice_period: e.target.value,
                    });
                  }}
                  value={leaseTemplate.lease_cancellation_notice_period}
                  className="form-select"
                  sx={{ width: "100%", color: uiGrey2 }}
                >
                  <option value="">Select One</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={13}>13 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
                <span style={validationMessageStyle}>
                  {errors.lease_cancellation_notice_period &&
                    errors.lease_cancellation_notice_period.message}
                </span>
              </div>
              <div className="form-group col-sm-12 col-md-6 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="leaseCancellationFee"
                >
                  Lease Cancellation Fee
                </Typography>
                <input
                  {...register("lease_cancellation_fee", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("lease_cancellation_fee");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      lease_cancellation_fee: e.target.value,
                    });
                  }}
                  value={leaseTemplate.lease_cancellation_fee}
                  type="number"
                  className="form-control"
                  id="leaseCancellationFee"
                  placeholder="$"
                />
                <span style={validationMessageStyle}>
                  {errors.lease_cancellation_fee &&
                    errors.lease_cancellation_fee.message}
                </span>
              </div>
              <div className="form-group col-sm-12 col-md-6 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="rent"
                >
                  Lease Renewal Notice Period
                </Typography>
                <select
                  {...register("lease_renewal_notice_period", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("lease_cancellation_notice_period");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      lease_renewal_notice_period: e.target.value,
                    });
                  }}
                  value={leaseTemplate.lease_renewal_notice_period}
                  className="form-select"
                  sx={{ width: "100%", color: uiGrey2 }}
                >
                  <option value="">Select One</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={13}>13 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
                <span style={validationMessageStyle}>
                  {errors.lease_renewal_notice_period &&
                    errors.lease_renewal_notice_period.message}
                </span>
              </div>
              <div className="form-group col-sm-12 col-md-6 mb-4">
                <Typography
                  className="mb-2"
                  sx={{ color: uiGrey2, fontSize: "12pt" }}
                  htmlFor="leaseRenewalFee"
                >
                  Lease Renewal Fee
                </Typography>
                <input
                  {...register("lease_renewal_fee", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[0-9]+$/i,
                    //   message: "Please enter a valid number",
                    // },
                  })}
                  onChange={(e) => {
                    // trigger("lease_cancellation_fee");
                    setLeaseTemplate({
                      ...leaseTemplate,
                      lease_renewal_fee: e.target.value,
                    });
                  }}
                  value={leaseTemplate.lease_renewal_fee}
                  type="number"
                  className="form-control"
                  id="leaseRenewalFee"
                  placeholder="$"
                />
                <span style={validationMessageStyle}>
                  {errors.lease_renewal_fee &&
                    errors.lease_renewal_fee.message}
                </span>
              </div>


              
              <div className="form-group col-md-12">
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    color: "white",
                    background: uiGreen,
                    float: "right",
                  }}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Additional Charges */}
      {tabPage === 1 && (
        <>
          <div className="card">
            <div className="card-body">{additionalChargesForm()}</div>
          </div>
        </>
      )}
      {tabPage === 2 && (
        <>
          <UITable
            columns={columns}
            options={options}
            data={units}
            title="Units"
            showCreate={false}
          />
        </>
      )}
      {tabPage === 3 && (
        <>
          <div className="card">
            <iframe src={editLink} height="1200px" width="100%" />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageLeaseTemplate;
