import React from "react";
import UICard from "./UICard";
import UITableMini from "../UITable/UITableMini";
const UITableMiniCard = (props) => {
  return (
    <UICard
      info={props.info}
      title={props.title}
      cardStyle={props.cardStyle}
      infoStyle={props.infoStyle}
      titleStyle={props.titleStyle}
      dropDownOptions={props.dropDownOptions}
      onDropdownChange={props.onDropdownChange}
    >
      <div style={props.tableStyle} >
        <UITableMini
          dataTestId={props.dataTestId}
          data={props.data ? props.data : null}
          endpoint={props.endpoint}
          columns={props.columns}
          options={props.options}
        />
      </div>
    </UICard>
  );
};

export default UITableMiniCard;
