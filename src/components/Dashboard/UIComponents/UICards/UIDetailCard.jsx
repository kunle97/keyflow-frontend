import React from "react";

const UIDetailCard = (props) => {
  return (
    <div className="card">
      <div className="card-body">
        {props.muiIcon}
        <h4 className="text-black" style={props.titleStyle}>
          {props.title}
        </h4>
        <p className="text-black" style={props.infoStyle}>
          {props.info}
        </p>
      </div>
    </div>
  );
};

export default UIDetailCard;
