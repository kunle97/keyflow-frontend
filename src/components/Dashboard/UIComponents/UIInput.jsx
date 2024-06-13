import React from "react";

const UIInput = (props) => {
  // const defaultStyles = {
  //   borderRadius: "5px",
  //   border: "none",
  //   padding: "5px 10px",
  //   outline: "none",
  //   backgroundColor: "#f4f7f8",
  //   boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
  //   display: "block",
  // };
  const disabledStyle = {
    color: "green",
  };
  return (
    <div>
      <div className="form-group">
        <label
          className="text-black mb-1"
          style={{ display: "block", ...props.labelStyles }}
        >
          {props.label}
        </label>
        <input
          className="form-control"
          style={{
            ...props.inputStyle,
            ...(props.disabled ? disabledStyle : {}),
          }}
          type={props.type ? props.type : "text"}
          placeholder={props.placeholder ? props.placeholder : ""}
          onChange={props.onChange ? props.onChange : () => {}}
          onBlur={props.onBlur ? props.onBlur : () => {}}
          defaultValue={props.defaultValue ? props.defaultValue : ""}
          name={props.name ? props.name : ""}
          step={props.step ? props.step : ""}
          disabled={props.disabled ? props.disabled : false}
          data-testId={props.dataTestId ? props.dataTestId : ""}
        />
        <small id="amountHelp" className="form-text text-muted">
          {props.description ? props.description : ""}
        </small>
      </div>
    </div>
  );
};

export default UIInput;
