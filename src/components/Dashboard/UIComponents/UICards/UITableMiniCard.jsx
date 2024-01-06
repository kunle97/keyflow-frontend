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
      <UITableMini
        data={props.data ? props.data : null}
        endpoint={props.endpoint}
        columns={props.columns}
        options={props.options}
      />
    </UICard>
  );
};

export default UITableMiniCard;
