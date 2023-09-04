import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { makePayment } from "../../../api/api";
import { authUser } from "../../../constants";
import { uiGreen, uiGrey1 } from "../../../constants";
import UIButton from "../UIButton";
const PaymentModal = (props) => {
  /*
   *Payment data structure
   *        {
   *       user_id: data.user_id,
   *       payment_method_id: data.payment_method_id,
   *      amount: data.amount,
   *    },
   */
  const [isLoading, setIsLoading] = useState(false);
  const [selectPaymentMode, setSelectPaymentMode] = useState(true);
  const [paymentResponseMessage, setPaymentResponseMessage] = useState(null);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: uiGrey1,
    color: "white",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    props.paymentMethods[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Payment Method", selectedPaymentMethod);
    const data = {
      user_id: authUser.id,
      payment_method_id: selectedPaymentMethod.id,
      amount: props.amount,
    };
    console.log(data);
    makePayment(data)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setSelectPaymentMode(false);
        if (res.status === 200) {
          console.log("Payment successful");
          setPaymentResponseMessage("Payment successful!");
        } else {
          // props.handleClose();
          // props.handleFailure();
          console.log("Payment failed");
          setPaymentResponseMessage("Payment failed");
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Catch: Payment failed");
      });
  };

  return (
    <div>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box sx={style}>
          {!isLoading && selectPaymentMode && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Amount of ${`${props.amount / 100}`} will be charged to your
                card
              </Typography>
              <FormControl>
                <FormLabel sx={{ color: "white" }}>
                  Please select a payment method
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="paymentMethod"
                  name="paymentMethod"
                  defaultValue={props.paymentMethods[0].id}
                  //   onChange={() => setSelectedPaymentMethod(paymentMethod)}
                >
                  {console.log(props.paymentMethods[0].id)}
                  {props.paymentMethods.map((paymentMethod) => {
                    return (
                      <>
                        <FormControlLabel
                          value={paymentMethod.id}
                          control={
                            <Radio
                              sx={{
                                color: "white",
                                "&.Mui-checked": {
                                  color: uiGreen,
                                },
                              }}
                              onSelect={() => {
                                setSelectedPaymentMethod(paymentMethod);
                                console.log("onSelect");
                                console.log(
                                  "CUrrent Selected Payment Method",
                                  selectedPaymentMethod
                                );
                              }}
                              onClick={() => {
                                setSelectedPaymentMethod(paymentMethod);
                                console.log("onCLick");
                                console.log(
                                  "CUrrent Selected Payment Method",
                                  selectedPaymentMethod
                                );
                              }}
                            />
                          }
                          label={`${
                            paymentMethod.card.brand
                          } ending in ${" "}  ${paymentMethod.card.last4}`}
                          sx={{ color: "white" }}
                        />
                      </>
                    );
                  })}{" "}
                </RadioGroup>
              </FormControl>
              <Stack direction="row">
                <Button
                  onClick={props.handleClose}
                  style={{
                    marginTop: "20px",
                    backgroundColor: "red",
                    marginRight: "20px",
                  }}
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  style={{
                    marginTop: "20px",
                    backgroundColor: uiGreen,
                    marginRight: "20px",
                  }}
                  variant="contained"
                >
                  Pay Now
                </Button>
              </Stack>
            </>
          )}
          {isLoading && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Processing your Payment...
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Box m={"55px auto"}>
                  <CircularProgress sx={{ color: uiGreen }} />
                </Box>
              </Box>
            </>
          )}
          {!isLoading && !selectPaymentMode && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {paymentResponseMessage}
              </Typography>
              <UIButton
                style={{ marginTop: "15px" }}
                disabled={false}
                btnText={"Close"}
                onClick={props.handleClose}
              />
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default PaymentModal;
