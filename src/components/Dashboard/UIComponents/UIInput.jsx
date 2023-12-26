import React from "react";

const UIInput = (props) => {
  const defaultStyles = {
    borderRadius: "5px",
    border: "none",
    padding: "5px",
  };
  return (
    <div>
      <input
        style={{ ...props.style, ...defaultStyles }}
        type={props.type ? props.type : "text"}
        placeholder={props.placeholder ? props.placeholder : ""}
        onChange={props.onChange ? props.onChange : () => {}}
      />
    </div>
  );
};

export default UIInput;
