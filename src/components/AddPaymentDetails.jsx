import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import { uiGreen } from "../constants";
import { stripePromise } from "../constants";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const AddPaymentDetails = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const [nameOnCard, setNameOnCard] = useState(faker.person.fullName());
  const [cardNumber, setCardNumber] = useState("4242424242424242");
  const [cardExpirationMonth, setCardExpirationMonth] = useState("02");
  const [cardExpirationYear, setCardExpirationYear] = useState("2300");
  const [cardCVV, setCardCVV] = useState(faker.finance.creditCardCVV());

  const [cardMode, setCardMode] = useState(true);

  const handleSubmit = async (e) => {
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
      console.log("PaymentMethod:", paymentMethod);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="row">
      <div>
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
      </div>
      {cardMode ? (
        <>
          <div className="col-md-12 mb-3">
            <label className="form-label">Name On Card</label>
            <input
              className="form-control "
              type="text"
              id="nameOnCard"
              placeholder="Name on Card"
              name="name_on_card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Card Number</label>

            <input
              className="form-control "
              type="text"
              id="cardNumber"
              placeholder="Card Number"
              name="card_number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Expiration Month</label>
            <input
              className="form-control "
              type="text"
              id="cardExpirationMonth"
              placeholder="mm"
              name="exp_month"
              value={cardExpirationMonth}
              onChange={(e) => setCardExpirationMonth(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Expiration Year</label>
            <input
              className="form-control "
              type="text"
              id="cardExpirationYear"
              placeholder="yyyy"
              name="exp_year"
              value={cardExpirationYear}
              onChange={(e) => setCardExpirationYear(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">CVC</label>
            <input
              className="form-control "
              type="text"
              id="cardCVV"
              placeholder="Card CVC"
              name="cvc"
              value={cardCVV}
              onChange={(e) => setCardCVV(e.target.value)}
              required
            />
          </div>
        </>
      ) : (
        <>
          <div className="col-md-12 mb-3">
            <label className="form-label">Account Holder Name</label>
            <input
              className="form-control "
              type="text"
              name="account_holder_name"
              placeholder="Account Holder Name"
            />
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Account Type</label>
            <select name="bank_account_type" className="form-select">
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Bank Name</label>
            <input
              className="form-control "
              type="text"
              name="bank_name"
              placeholder="Bank Name"
            />
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Account Number</label>
            <input
              className="form-control "
              type="text"
              name="routing_number"
              placeholder="Bank Account Nmmber"
            />
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Routing Number</label>
            <input
              className="form-control "
              type="text"
              name="routing_number"
              placeholder="Rounting Number"
              required
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AddPaymentDetails;
