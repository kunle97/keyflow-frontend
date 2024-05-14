import React from "react";
import { uiRed, validationMessageStyle } from "../../../../../../../constants";
import UIButton from "../../../../../UIComponents/UIButton";

const ChargeRow = (props) => {
  const { name, amount, frequency } = props.charge;

  return (
    <div className="row mt-3">
      <div className="col-md-3">
        <label className="form-label text-white" htmlFor="street">
          <strong>Charge</strong>
        </label>
        <input
          {...props.register(`additionalCharge_${props.index}`)}
          type="text"
          defaultValue={name}
          onChange={(e) => {
            let newCharges = [...props.addtionalCharges];
            newCharges[props.index].name = e.target.value;
            props.setAddtionalCharges(newCharges);
          }}
          className="form-control"
        />
        <span className={validationMessageStyle}>
          {props.errors[`additionalCharge_${props.index}`] &&
            props.errors[`additionalCharge_${props.index}`]?.message}
        </span>
      </div>
      <div className="col-md-3">
        <label className="form-label text-white" htmlFor="street">
          <strong>Amount</strong>
        </label>
        <input
          {...props.register(`additionalChargeAmount_${props.index}`)}
          type="number"
          defaultValue={amount}
          onChange={(e) => {
            let newCharges = [...props.addtionalCharges];
            newCharges[props.index].amount = e.target.value;
            props.setAddtionalCharges(newCharges);
          }}
          className="form-control"
        />
        <span className={validationMessageStyle}>
          {props.errors[`additionalChargeAmount_${props.index}`] &&
            props.errors[`additionalChargeAmount_${props.index}`]?.message}
        </span>
      </div>
      <div className="col-md-3">
        <label className="form-label text-white" htmlFor="street">
          <strong>Frequency</strong>
        </label>
        <select
          {...props.register(`additionalChargeFrequency_${props.index}`)}
          className="form-control"
          defaultValue={frequency}
        >
          <option value="">Select Frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <span className={validationMessageStyle}>
          {props.errors[`additionalChargeFrequency_${props.index}`] &&
            props.errors[`additionalChargeFrequency_${props.index}`]?.message}
        </span>
      </div>
      {props.index !== 0 && (
        <div className="col-md-3">
          <UIButton
            onClick={() => props.removeCharge(props.index)}
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
  );
};

export default ChargeRow;
