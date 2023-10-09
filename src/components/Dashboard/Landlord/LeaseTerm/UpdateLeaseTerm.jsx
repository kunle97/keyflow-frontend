import { Button, Input, Tooltip, Typography } from "@mui/material";
import React from "react";
import { MenuItem, Select } from "@mui/material";
import {
  uiGreen,
  uiGrey2,
  validationMessageStyle,
} from "../../../../constants";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useEffect } from "react";
import { authenticatedInstance } from "../../../../api/api";
import UIBinaryRadioGroup from "../../UIComponents/UIBinaryRadioGroup";
import { useState } from "react";
import { HelpOutline } from "@mui/icons-material";
const UpdateLeaseTerm = () => {
  const { id } = useParams();
  const [leaseTerm, setLeaseTerm] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rent: leaseTerm.rent,
      term: leaseTerm.term,
      late_fee: leaseTerm.late_fee,
      security_deposit: leaseTerm.security_deposit,
      gas_included: leaseTerm.gas_included,
      water_included: leaseTerm.water_included,
      electricity_included: leaseTerm.electricity_included,
      repairs_included: leaseTerm.repairs_included,
      lease_cancellation_notice_period:
        leaseTerm.lease_cancellation_notice_period,
      lease_description: leaseTerm.lease_description,
    },
  });

  const onSubmit = async (data) => {
    await authenticatedInstance.put(`/lease-terms/${id}/`, data).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    authenticatedInstance.get(`/lease-terms/${id}/`).then((res) => {
      setLeaseTerm(res.data);
    });
  }, []);
  return (
    <div className="container">
      <h2 style={{ color: "white" }}>Update Lease Term</h2>
      <div className="card">
        <div className="card-body" style={{ overflow: "auto" }}>
          <form className="row" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group col-md-6 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Rent (Dollar Amount)
              </Typography>
              <input
                {...register("rent", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Please enter a valid number",
                  },
                })}
                defaultValue={leaseTerm.rent}
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
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Term Duration
              </Typography>
              <select
                {...register("term", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Please enter a valid number",
                  },
                })}
                defaultValue={leaseTerm.term}
                className="form-select"
                sx={{ width: "100%", color: "white", background: uiGrey2 }}
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
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="lateFee"
              >
                Late Fee
              </Typography>
              <input
                {...register("late_fee", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Please enter a valid number",
                  },
                })}
                defaultValue={leaseTerm.late_fee}
                type="text"
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
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Security Deposit (Dollar Amount)
              </Typography>
              <input
                {...register("security_deposit", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Please enter a valid number",
                  },
                })}
                defaultValue={leaseTerm.security_deposit}
                type="text"
                className="form-control"
                id="security_deposit"
                placeholder="$"
              />
              <span style={validationMessageStyle}>
                {errors.security_deposit && errors.security_deposit.message}
              </span>
            </div>

            <div className="form-group col-md-6 mb-4">
              <label className="mb-2">Gas Included</label>
              <select
                {...register("gas_included", {
                  required: "This field is required",
                })}
                defaultValue={leaseTerm.gas_included}
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
              <label className="mb-2">Water Included</label>
              <select
                {...register("water_included", {
                  required: "This field is required",
                })}
                className="form-control"
                defaultValue={leaseTerm.water_included}
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
              <label className="mb-2">Electric Included</label>
              <select
                {...register("electric_included", {
                  required: "This field is required",
                })}
                defaultValue={leaseTerm.electric_included}
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
              <label className="mb-2">Repairs Included</label>
              <select
                {...register("repairs_included", {
                  required: "This field is required",
                })}
                defaultValue={leaseTerm.repairs_included}
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
                sx={{ color: "white", fontSize: "12pt" }}
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
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Please enter a valid number",
                  },
                })}
                defaultValue={leaseTerm.grace_period}
                className="form-select"
                sx={{ width: "100%", color: "white" }}
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
            <div className="form-group col-md-12 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Lease Cancellation Notice Period
              </Typography>
              <select
                {...register("lease_cancellation_notice_period", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Please enter a valid number",
                  },
                })}
                defaultValue={leaseTerm.lease_cancellation_notice_period}
                className="form-select"
                sx={{ width: "100%", color: "white" }}
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
            <div className="form-group col-md-12 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="leaseCancellationFee"
              >
                Lease Cancellation Fee
              </Typography>
              <input
                {...register("lease_cancellation_fee", {
                  required: "This field is required",
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Please enter a valid number",
                  },
                })}
                defaultValue={leaseTerm.lease_cancellation_fee}
                type="text"
                className="form-control"
                id="leaseCancellationFee"
                placeholder="$"
              />
              <span style={validationMessageStyle}>
                {errors.lease_cancellation_fee &&
                  errors.lease_cancellation_fee.message}
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
    </div>
  );
};

export default UpdateLeaseTerm;
