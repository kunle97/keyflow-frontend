import React from "react";
import UIDialog from "../../Modals/UIDialog";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { uiGreen } from "../../../../../constants";
import UIButton from "../../UIButton";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const RentPriceSuggestionModal = (props) => {
  return (
    <div>
      <UIDialog
        title="Rental Unit Optimization"
        onClose={props.onClose}
        open={props.open}
      >
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <h6>
              <PriceChangeIcon
                sx={{
                  color: uiGreen,
                }}
              />{" "}
              Rent Price
            </h6>
          </AccordionSummary>

          <AccordionDetails>
            <div className="row">
              <div className="col-md-6">
                <h6 className="text-center">
                  <b>Highest Rent</b>
                </h6>
                <p className="text-center text-black">$4,300/mo</p>
              </div>
              <div className="col-md-6">
                <h6 className="text-center">
                  <b>Lowest Rent</b>
                </h6>
                <p className="text-center text-black">$2,500/mo</p>
              </div>
              <div className="col-md-6">
                <h6 className="text-center">
                  <b>Average Rent</b>
                </h6>
                <p className="text-center text-black">$3,675/mo</p>
              </div>
              <div className="col-md-6">
                <h6 className="text-center">
                  <b>Suggested Rent Price</b>
                </h6>
                <p className="text-center text-black">$3,000/mo</p>
              </div>
            </div>
            {/* <p
              className="text-muted"
              style={{
                  fontSize: "10pt",
                  marginTop: "0.5rem",
                  marginBottom: "0",
                }}
                >
                *The rent prices listed above is based on data gathered rent
                prices in the area.
            </p> */}
          </AccordionDetails>
          <AccordionActions
            style={{
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <UIButton
              btnText="Use Suggested Rent Price"
              style={{ width: "100%" }}
              onClick={props.onClose}
            />
          </AccordionActions>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <h6>
              <PriceCheckIcon
                sx={{
                  color: uiGreen,
                }}
              />{" "}
              Additional Charges
            </h6>
          </AccordionSummary>
        </Accordion>
      </UIDialog>
    </div>
  );
};

export default RentPriceSuggestionModal;
