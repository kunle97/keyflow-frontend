import React, { useState, useEff } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import { uiGreen } from "../constants";

const AddPaymentDetails = () => {
  const [nameOnCard, setNameOnCard] = useState(faker.person.fullName());
  const [cardNumber, setCardNumber] = useState(
    faker.finance.creditCardNumber()
  );
  const [cardExpiration, setCardExpiration] = useState();
  const [cardCVV, setCardCVV] = useState(faker.finance.creditCardCVV());

  const [cardMode, setCardMode] = useState(true);

  return (
    <div className="row">
      <div>
        <FormControl>
          <FormLabel
            sx={{ color: "white", fontSize: "12pt" }}
            id="payment-type"
          >
            Method Type
          </FormLabel>
          <RadioGroup row defaultValue={"card"} aria-labelledby="payment-type" name="gas_included">
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
          <div className="col-md-12 mb-2">
            <Input
              className="form-control form-control-user"
              type="text"
              id="nameOnCard"
              placeholder="Name on Card"
              name="name_on_card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
          </div>
          <div className="col-md-12 mb-2">
            <Input
              className="form-control form-control-user"
              type="text"
              id="cardNumber"
              placeholder="Name on Card"
              name="card_number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <Input
              className="form-control form-control-user"
              type="text"
              id="cardExpiration"
              placeholder="mm/yyyy"
              name="card_expiration"
              value={cardExpiration}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <Input
              className="form-control form-control-user"
              type="text"
              id="cardCVV"
              placeholder="Card CVV"
              name="card_cvv"
              value={cardCVV}
              onChange={(e) => setCardCVV(e.target.value)}
              required
            />
          </div>
        </>
      ) : (
        <>
          <div className="col-md-12 mb-4">
            <Input
              className="form-control form-control-user"
              type="text"
              name="account_holder_name"
              placeholder="Account Holder Name"
            />
          </div>
          <div className="col-md-12 mb-2">
            <InputLabel sx={{ color: "white", marginBottom: "15px" }}>
              Account Type
            </InputLabel>
            <Select
              name="account_type"
              sx={{
                // backgroundColor: "white",
                width: "100%",
                color: "black",
                borderColor: "white !important",
                // padding: "5px",
              }}
            >
              <MenuItem value="checking">Checking</MenuItem>
              <MenuItem value="savings">Savings</MenuItem>
            </Select>
          </div>
          <div className="col-md-12 mb-2">
            <Input
              className="form-control form-control-user"
              type="text"
              name="bank_name"
              placeholder="Bank Name"
            />
          </div>
          <div className="col-md-12 mb-2">
            <Input
              className="form-control form-control-user"
              type="text"
              name="routing_number"
              placeholder="Bank Account Nmmber"
            />
          </div>
          <div className="col-md-12 mb-2">
            <Input
              className="form-control form-control-user"
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
