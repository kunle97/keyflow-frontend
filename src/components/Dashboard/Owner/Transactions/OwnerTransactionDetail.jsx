import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { getProperty } from "../../../../api/properties";
import { getTransactionById } from "../../../../api/transactions";
import { getUnit } from "../../../../api/units";
import { getUserData } from "../../../../api/auth";
import { useState } from "react";
import BackButton from "../../UIComponents/BackButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { uiGreen, uiGrey2 } from "../../../../constants";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import useScreen from "../../../../hooks/useScreen";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const OwnerTransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState({}); //initialize transaction state
  const [tenant, setTenant] = useState({}); //initialize tenant state
  const [property, setProperty] = useState({}); //initialize property state
  const [unit, setUnit] = useState({}); //initialize unit state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const { isMobile } = useScreen();
  useEffect(() => {
    try {
      //retrieve transaction by id from api
      getTransactionById(id).then((res) => {

        setTransaction(res.data);
        //retrieve property by id from api
        getProperty(res.data.rental_property).then((res) => {

          setProperty(res);
        });
        //retrieve unit by id from api
        getUnit(res.data.rental_unit).then((res) => {

          setUnit(res);
        });
        getUserData(res.data.tenant).then((res) => {

          setTenant(res.data);
        });
      });
    } catch (error) {
      console.error("Error fetching transaction", error);
      setAlertTitle("Error!");
      setAlertMessage(
        "There was an error fetching transaction. Please try again."
      );
      setShowAlert(true);
    }
  },[]);

  return (
    <div className={isMobile ? "container" : ""}>
      <AlertModal
        open={showAlert}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
      <div className="row">
        {" "}
        <div className="col-md-5  offset-md-3 mt-3">
          <BackButton to="/dashboard/owner/transactions" />
          <div className={`${isMobile ? "" : "card"} mb-4`} data-testId="transaction-detail-card" >
            <center className={` ${!isMobile ? "mt-3  py-4" : "mb-4"}`}>
              <CheckCircleOutlineIcon
                style={{ fontSize: 50, color: uiGreen, marginBottom: 12 }}
              />
              <h3 className="card-title  text-black" data-testId="transaction-detail-card-title" >Transaction Details</h3>
            </center>
            <div className="card-body">
              <div className="row">
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto", color: uiGrey2 }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }} data-testId="amount-label" >
                    <strong>Amount</strong>
                  </span>{" "}
                  <span style={{ float: "right" }} data-testId="amount-value" >${transaction.amount}</span>
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto", color: uiGrey2 }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }} data-testId="type-label" >
                    <strong>Type</strong>
                  </span>{" "}
                  <span style={{ float: "right" }} data-testId="type-value" >
                    {transaction.type
                      ? removeUnderscoresAndCapitalize(transaction.type)
                      : ""}
                  </span>
                </div>

                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto", color: uiGrey2 }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }} data-testId="date-label">
                    <strong>Date</strong>{" "}
                  </span>
                  <span style={{ float: "right" }} data-testId="date-value">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-md-12" style={{ color: uiGrey2 }}>
                  <span style={{ fontSize: "14pt" }} data-testId="description-label" >
                    <strong>Description:</strong>
                  </span>{" "}
                  <p data-testId="description-value" >{transaction.description}</p>
                </div>

                {transaction.billing_entry && (
                  <div
                    className="col-md-12 mb-3"
                    style={{
                      fontSize: "14pt",
                      overflow: "auto",
                      width: "100%",
                    }}
                  >
                    <Stack
                      spacing={2}
                      direction="row"
                      alignContent={"center"}
                      justifyContent={"center"}
                    >
                      <Link
                        data-testid="view-billing-entry-link"
                        to={`/dashboard/owner/billing-entries/${transaction.billing_entry.id}`}
                        sx={{
                          color: uiGreen,
                          textTransform: "None",
                          margin: "auto",
                        }}
                      >
                        View Billing Entry
                      </Link>
                    </Stack>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerTransactionDetail;
