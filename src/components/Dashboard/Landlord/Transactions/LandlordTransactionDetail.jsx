import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { getTransactionById, getUserData } from "../../../../api/api";
import { useState } from "react";
import BackButton from "../../BackButton";
const LandlordTransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState({}); //initialize transaction state
  const [tenant, setTenant] = useState({}); //initialize tenant state
  useEffect(() => {
    //retrieve transaction by id from api
    getTransactionById(id).then((res) => {
      console.log(res);
      setTransaction(res.data);
      getUserData(res.data.tenant).then((res) => {
        console.log(res);
        setTenant(res.data);
      });
    });
  }, []);

  return (
    <div>
      <BackButton to="/dashboard/landlord/transactions" />
      <div className="row">
        {" "}
        <div className="col-md-4">
          <h4 className="card-title">Tenant Information</h4>
          <div className="card">
            <div className="card-header"></div>
            <div className="card-body row">
              <div className="col-md-6">
                <p>
                  <strong>Tenant:</strong> {tenant.first_name}{" "}
                  {tenant.last_name}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Email:</strong> {tenant.email}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Phone:</strong> {tenant.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <h4 className="card-title">Transaction Details</h4>
          <div className="card">
            <div className="card-header"></div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Amount:</strong>
                  </p>{" "}
                  ${transaction.amount}
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Type:</strong>
                  </p>{" "}
                  {transaction.type}
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Date:</strong>{" "}
                  </p>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </div>
                <div className="col-md-12">
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
