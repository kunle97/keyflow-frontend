import React from "react";

const UIDetailCard = (props) => {
  return (
    <div
      className="card"
      data-testid={props.dataTestId}
      style={props.style ? props.style : {}}
    >
      <div className="card-body">
        {props.muiIcon}
        <h4
          className="text-black"
          style={props.titleStyle}
          data-testId={props.dataTestId ? `${props.dataTestId}-title` : ""}
        >
          {props.title}
        </h4>
        <p
          className="text-black"
          style={props.infoStyle}
          data-testId={props.dataTestId ? `${props.dataTestId}-info` : ""}
        >
          {props.info}
        </p>
      </div>
    </div>
  );
};

export default UIDetailCard;
