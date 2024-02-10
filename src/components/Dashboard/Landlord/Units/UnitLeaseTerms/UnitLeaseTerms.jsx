import React from "react";
import UIPreferenceRow from "../../../UIComponents/UIPreferenceRow";
import UIPrompt from "../../../UIComponents/UIPrompt";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";
import { uiGreen } from "../../../../../constants";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { defaultRentalUnitLeaseTerms } from "../../../../../constants/lease_terms";
const UnitLeaseTerms = (props) => {
  const iconStyles = {
    color: uiGreen,
    fontSize: "3rem",
  };
  return (
    <div>
      {props.unitLeaseTerms ? (
        props.unitLeaseTerms.map((preference) => {
          if (preference.inputType === "select") {
            const selectOptions = preference.options;
            return (
              <UIPreferenceRow
                title={preference.label}
                value={preference.value}
                description={preference.description}
                type={preference.inputType}
                selectOptions={selectOptions}
                onChange={(e) =>
                  props.handleChangeUnitLeaseTerms(e, preference.name)
                }
              />
            );
          } else if (preference.inputType === "switch") {
            return (
              <UIPreferenceRow
                title={preference.label}
                value={preference.value}
                description={preference.description}
                type={preference.inputType}
                onChange={props.handlePreferenceSwitchChange(preference.name)}
              />
            );
          } else {
            return (
              <UIPreferenceRow
                title={preference.label}
                value={preference.value}
                description={preference.description}
                type={preference.inputType}
                onChange={(e) =>
                  props.handleChangeUnitLeaseTerms(e, preference.name)
                }
              />
            );
          }
        })
      ) : (
        <div>
          {defaultRentalUnitLeaseTerms.map((preference) => {
            if (preference.inputType === "select") {
              const selectOptions = preference.options;
              return (
                <UIPreferenceRow
                  title={preference.label}
                  value={preference.value}
                  description={preference.description}
                  type={preference.inputType}
                  selectOptions={selectOptions}
                  onChange={(e) =>
                    props.handleChangeUnitLeaseTerms(e, preference.name)
                  }
                />
              );
            } else if (preference.inputType === "switch") {
              return (
                <UIPreferenceRow
                  title={preference.label}
                  value={preference.value}
                  description={preference.description}
                  type={preference.inputType}
                  onChange={props.handlePreferenceSwitchChange(preference.name)}
                />
              );
            } else {
              return (
                <UIPreferenceRow
                  title={preference.label}
                  value={preference.value}
                  description={preference.description}
                  type={preference.inputType}
                  onChange={(e) =>
                    props.handleChangeUnitLeaseTerms(e, preference.name)
                  }
                />
              );
            }
          })} 
        </div>
      )}
      {props.unit.is_occupied && (
        <>
          <UIPrompt
            style={{
              marginTop: "15px",
            }}
            icon={<NoMeetingRoomIcon style={iconStyles} />}
            title="Unit Occupied"
            message="You cannot edit the lease terms for this unit because it is occupied."
            body={
              <div className="row">
                <div className="col-md-12">
                  <Link to={`/dashboard/landlord/tenants/${props.tenant?.id}`}>
                    <Button
                      style={{
                        background: uiGreen,
                        color: "white",
                        textTransform: "none",
                        marginTop: "1rem",
                        width: "100%",
                      }}
                    >
                      View Tenant
                    </Button>
                  </Link>
                </div>
              </div>
            }
          />
        </>
      )}
    </div>
  );
};

export default UnitLeaseTerms;
