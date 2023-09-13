import React from "react";

const TitleCard = (props) => {
  return (
    <div
      className="card text-white shadow"
      style={{ ...props.style, background: props.backgroundColor }}
    >
      <div className="card-body">
        <div className="row mb-2">
          <div className="col">
            <p className="m-0">{props.title}</p>
            <p className="m-0">
              <strong>{props.value}</strong>
            </p>
          </div>
          <div className="col-auto">{props.icon}</div>
        </div>
        <p className="text-white-50 small m-0">
          {props.subTextIcon && props.subTextIcon}
          {props.subtext}
        </p>
      </div>
    </div>
  );
};

export default TitleCard;
