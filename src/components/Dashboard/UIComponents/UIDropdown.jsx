import React from "react";

const UIDropdown = (props) => {
  const defaultStyles = {
    borderRadius: "5px",
    border: "none",
    padding: "5px",
  };
  return (
    <div>
      <span>{props.prefixText ? props.prefixText : ""} </span>
      <select
        value={props.value}
        onChange={props.onChange}
        style={{ ...defaultStyles, ...props.style }}
      >
        {props.options.map((option, index) => {
          return (
            <option key={index} value={option.value ? option.value : option}>
              {option}
            </option>
          );
        })}
      </select>
      <span>{props.suffixText ? props.suffixText : ""}</span>
    </div>
  );
};

export default UIDropdown;
