import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import {
  addStripePaymentMethod,
} from "../../api/payment_methods";
import { authUser, uiGreen } from "../../constants";
import UIButton from "./UIComponents/UIButton";
import ProgressModal from "./UIComponents/Modals/ProgressModal";
import AlertModal from "./UIComponents/Modals/AlertModal";
import BackButton from "./UIComponents/BackButton";
import { useNavigate } from "react-router";
const AddPaymentMethod = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMode, setErrorMode] = useState(false); //If true, display error message
  const [successMode, setSuccessMode] = useState(false); //If true, display error message

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      // You can now send paymentMethod.id to your server for further processing.
      const data = {
        payment_method_id: paymentMethod.id,
        user_id: authUser.id,
      };

      addStripePaymentMethod(data).then((res) => {

        if (res.status === 200) {
          setMessage(res.message);
          setSuccessMode(true);
          setIsLoading(false);
          //If success redirect to dashboard
        }
      });
    } catch (err) {

      setMessage("Please enter a valid card number");
      setErrorMode(true);
      setSuccessMode(false);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="container pb-4">
      {props.hideBackButton ?? <BackButton />}
      <ProgressModal open={isLoading} />
      <AlertModal
        open={errorMode}
        title="Error"
        message={message}
        handleClose={() => setErrorMode(false)}
        onClick={() => setErrorMode(false)}
        btnText="Close"
      />
      <AlertModal
        open={successMode}
        title="Success"
        message={message}
        handleClose={() => setSuccessMode(false)}
        onClick={() => navigate(-1)}
        btnText="Close"
        to={props.returnTo}
      />

      <div className={props.hideBoxShaddow ? "" : "card"}>
        <div className="card-body">
          {props.hideTitle ?? <h5 className="mb-3">Add A Payment Method</h5>}
          <div className="stripeSection">
            <>
              {" "}
              <div className="form-row">
                <label className="form-label text-black" htmlFor="card-element">
                  Credit or Debit Card
                </label>
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "black",
                          marginBottom: "15px",
                        },
                      },
                    }}
                  />
                </div>
              </div>
              {message && (
                <div
                  className="error-message"
                  style={{ fontSize: "14pt", width: "100%", color: uiGreen }}
                >
                  {message}
                </div>
              )}
            </>
            <UIButton
              onClick={handleSubmit}
              btnText="Add Payment Method"
              style={{ marginTop: "15px", width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentMethod;
