import React, { useEffect } from "react";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PlaidLink } from "react-plaid-link";
import { addStripePaymentMethod } from "../../../api/payment_methods";
import { createPlaidLinkToken } from "../../../api/auth";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { authUser, uiGreen, uiGrey1 } from "../../../constants";
import UIButton from "../UIComponents/UIButton";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import AlertModal from "../UIComponents/Modals/AlertModal";
import { ArrowBack } from "@mui/icons-material";
import BackButton from "../UIComponents/BackButton";
import { useNavigate } from "react-router";
const AddPaymentMethod = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [cardMode, setCardMode] = useState(true);
  const [returnToken, setReturnToken] = useState(null); //Value of either the Stripe token or the Plaid token
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
      if (cardMode) {
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });
        const { token } = await stripe.createToken(cardElement);
        // You can now send paymentMethod.id to your server for further processing.
        setReturnToken(token.id);
        console.log("Return Token:", returnToken);
        console.log("PaymentMethod:", paymentMethod);
        const data = {
          payment_method_id: paymentMethod.id,
          user_id: authUser.user_id,
        };
        console.log(data);
        addStripePaymentMethod(data).then((res) => {
          console.log(res);
          if (res.status === 200) {
            setMessage(res.message);
            setSuccessMode(true);
            setIsLoading(false);
            //If success redirect to dashboard
          }
        });
      } else {
      }
    } catch (err) {
      console.log(err);
      if (cardMode) {
        setMessage("Please enter a valid card number");
      } else {
        setMessage("Error Adding your bank account");
      }
      setErrorMode(true);
      setSuccessMode(false);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handlePlaidSuccess = (token, metadata) => {
    console.log(token);
    console.log(metadata);
    setReturnToken(token);
  };
  useEffect(() => {
    //Create a Plaid link token by callig the API
    // createPlaidLinkToken(`${authUser.user_id}`).then((res) => {
    createPlaidLinkToken(`1`).then((res) => {
      console.log("PLAID responseew", res);
      //Open the Plaid Link
      //Get the Plaid token from the Plaid Link
      //Set the return token to the Plaid token
    });
  }, []);
  return (
    <div className="">
      <BackButton />
      <h5 className="mb-3">Add A Payment Method</h5>
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

      <div className="card">
        <div className="card-body">
          <FormControl sx={{ marginBottom: "10px" }}>
            <FormLabel
              sx={{ color: "white", fontSize: "12pt" }}
              id="payment-type"
            >
              Method Type
            </FormLabel>
            <RadioGroup
              row
              defaultValue={"card"}
              aria-labelledby="payment-type"
              name="payment_method"
            >
              <FormControlLabel
                value="card"
                control={
                  <Radio
                    onClick={() => setCardMode(true)}
                    onSelect={() => setCardMode(true)}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: uiGreen,
                      },
                    }}
                  />
                }
                label="Debit/Credit Card"
                sx={{ color: "white" }}
              />
              <FormControlLabel
                value="bank_account"
                control={
                  <Radio
                    onClick={() => setCardMode(false)}
                    onSelect={() => setCardMode(false)}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: uiGreen,
                      },
                    }}
                  />
                }
                label="Bank Account"
                sx={{ color: "white" }}
              />
            </RadioGroup>
          </FormControl>
          <div className="stripeSection">
            {cardMode ? (
              <>
                {" "}
                <div className="form-row">
                  <label className="form-label" htmlFor="card-element">
                    Credit or Debit Card
                  </label>
                  <div
                    style={{
                      backgroundColor: uiGrey1,
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "white",
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
            ) : (
              <PlaidLink
                token={`${process.env.REACT_APP_PLAID_CLIENT_ID}`}
                onSuccess={handlePlaidSuccess}
                // Additional Plaid Link configuration options
              >
                Add Bank Account
              </PlaidLink>
            )}
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
