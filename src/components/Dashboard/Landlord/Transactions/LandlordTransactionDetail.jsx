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
const LandlordTransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState({}); //initialize transaction state
  const [tenant, setTenant] = useState({}); //initialize tenant state
  const [property, setProperty] = useState({}); //initialize property state
  const [unit, setUnit] = useState({}); //initialize unit state
  useEffect(() => {
    //retrieve transaction by id from api
    getTransactionById(id).then((res) => {
      console.log("Transaction Resposne ", res);
      setTransaction(res.data);
      //retrieve property by id from api
      getProperty(res.data.rental_property).then((res) => {
        console.log(res);
        setProperty(res);
      });
      //retrieve unit by id from api
      getUnit(res.data.rental_unit).then((res) => {
        console.log(res);
        setUnit(res);
      });
      getUserData(res.data.tenant).then((res) => {
        console.log(res);
        setTenant(res.data);
      });
    });
  }, []);

  return (
    <div>
      <div className="row">
        {" "}
        <div className="col-md-5  offset-md-3">
          <BackButton to="/dashboard/landlord/transactions" />
          <div className="card mb-4">
            <center className="py-4 mt-3">
              <CheckCircleOutlineIcon
                style={{ fontSize: 50, color: uiGreen, marginBottom: 12 }}
              />
              <h3 className="card-title  text-black">Transaction Details</h3>
            </center>
            <div className="card-body">
              <div className="row">
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto", color: uiGrey2 }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }}>
                    <strong>Amount</strong>
                  </span>{" "}
                  <span style={{ float: "right" }}>${transaction.amount}</span>
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto", color: uiGrey2 }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }}>
                    <strong>Type</strong>
                  </span>{" "}
                  <span style={{ float: "right" }}>{transaction.type}</span>
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto", color: uiGrey2 }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }}>
                    <strong>Property</strong>
                  </span>{" "}
                  <span style={{ float: "right" }}>{property.name}</span>
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto", color: uiGrey2 }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }}>
                    <strong>Unit</strong>
                  </span>{" "}
                  <span style={{ float: "right" }}>{unit.name}</span>
                </div>
                <div
                  className="col-md-12 mb-3"
                  style={{ fontSize: "14pt", overflow: "auto", color: uiGrey2 }}
                >
                  <span style={{ float: "left", fontSize: "14pt" }}>
                    <strong>Date</strong>{" "}
                  </span>
                  <span style={{ float: "right" }}>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-md-12" style={{ color: uiGrey2 }}>
                  <p>
                    <strong>Description:</strong>
                  </p>{" "}
                  {transaction.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordTransactionDetail;
