import React from "react";
import UIDialog from "../../Modals/UIDialog";
import UICheckbox from "../../UICheckbox";
import UIButton from "../../UIButton";

const ListUnitModal = (props) => {
  const listingPlatforms = [
    "Zillow",
    "Trulia",
    "Realtor.com",
    "Apartments.com",
    "StreetEasy",
    "Airbnb",
    "Booking.com",
    "Expedia",
    "TripAdvisor",
    "Vrbo",
  ];
  return (
    <div>
      <UIDialog title="List Unit" open={props.open} onClose={props.onClose}>
        <form>
          <div className="form-group mb-3">
            <label
              className="text-black"
              style={{
                fontSize: "15pt",
              }}
            >
              Platforms
            </label>
            <div className="row">
              {listingPlatforms.map((platform, index) => (
                <div className="col-md-4" key={index}>
                  <UICheckbox label={platform} />
                </div>
              ))}
            </div>
          </div>
          <div className="form-group mb-3">
            <label
              className="text-black"
              style={{
                fontSize: "15pt",
              }}
            >
              Description
            </label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Description"
            ></textarea>
          </div>
          <UIButton
            label="List Unit"
            btnText="List Unit"
            style={{
              width: "100%",
            }}
            onClick={props.onClose}
          />
        </form>
      </UIDialog>
    </div>
  );
};

export default ListUnitModal;
