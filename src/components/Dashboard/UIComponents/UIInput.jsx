import React from "react";

const UIInput = (props) => {
  const defaultStyles = {
    borderRadius: "5px",
    border: "none",
    padding: "5px 10px",
    outline: "none",
    backgroundColor: "white",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
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
