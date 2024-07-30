import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTenantInvoice } from "../../../../api/tenants";
import BackButton from "../../UIComponents/BackButton";
import { authUser, uiGreen, uiGrey2, uiRed } from "../../../../constants";
import PaymentModal from "../../UIComponents/Modals/PaymentModal";
import useScreen from "../../../../hooks/useScreen";
import { Chip, Stack } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { listStripePaymentMethods } from "../../../../api/payment_methods";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import scrollbarStyles from "./scrollbarStyles.module.css";
const BillDetail = (props) => {
  const { invoice_id } = useParams();
  const { isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [showAddPaymentMethodAlert, setShowAddPaymentMethodAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      getTenantInvoice(invoice_id).then((res) => {

        setInvoice(res.invoice);
      });
      listStripePaymentMethods(`${authUser.id}`).then((res) => {
        setIsLoadingPaymentMethods(true);
        if (res.data.length < 1) {
          setShowAddPaymentMethodAlert(true);
          setIsLoadingPaymentMethods(false);
        } else {
          setPaymentMethods(res.data);

          setIsLoadingPaymentMethods(false);
        }
      });
    } catch (error) {
      console.error(error);
      setShowAlert(true);
      setAlertMessage("An error occurred while fetching the invoice");
      setAlertTitle("Error");
    } finally {
      setIsLoading(false);
    }
  }, [invoice_id]);

  return (
    <>
      {isLoading ? (
        <UIProgressPrompt
          title="Loading Invoice..."
          message="Please wait while we fetch the invoice details"
        />
      ) : (
        <div className={isMobile ? "container" : ""}>
          <AlertModal
            open={showAlert}
            onClick={() => {
              setShowAlert(false);
            }}
            title={alertTitle}
            message={alertMessage}
          />
          {paymentMethods && (
            <PaymentModal
              open={openPaymentModal}
              handleClose={handleClosePaymentModal}
              paymentMethods={paymentMethods}
              invoices={[invoice]}
              amount={invoice && invoice.amount_due / 100}
            />
          )}
          <div className="row">
            {" "}
            <div className="col-md-7  offset-md-3 mt-3">
              <BackButton />
              <div className={`card mb-4`}>
                <div className="card-body">
                  {invoice && (
                    <div
                      className="col-md-12 mb-3"
                      style={{
                        fontSize: "14pt",
                        overflow: "auto",
                        color: uiGrey2,
                      }}
                    >
                      <Stack
                        spacing={0}
                        direction="column"
                        alignContent={"center"}
                        justifyContent="flex-start"
                      >
                        <span className="text-muted">
                          {removeUnderscoresAndCapitalize(
                            invoice?.metadata?.type
                          )}
                        </span>
                        <span style={{ fontSize: "30pt" }}>
                          {(invoice?.amount_due / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>{" "}
                        <div className="mt-2">
                          {invoice?.paid ? (
                            <Chip
                              label="Paid"
                              sx={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                backgroundColor: uiGreen,
                                color: "white",
                              }}
                              color="success"
                            />
                          ) : (
                            <Chip
                              label={
                                <span style={{ fontSize: "12pt" }}>
                                  Due:{" "}
                                  {new Date(
                                    invoice?.due_date * 1000
                                  ).toLocaleDateString()}
                                </span>
                              }
                              color="error"
                            />
                          )}
                        </div>
                      </Stack>
                    </div>
                  )}{" "}
                  <div
                  className={`${scrollbarStyles.customScrollbar}`}
                    style={{
                      maxHeight: "330px",
                      overflow: "auto",
                      paddiningRight: "100px",
                    }}
                  >
                    {invoice &&
                      invoice.lines.data.map((line, index) => {
                        return (
                          <div
                            key={index}
                            className="col-md-12 mb-3"
                            style={{
                              fontSize: "14pt",
                              overflow: "auto",
                              color: uiGrey2,
                            }}
                          >
                            <Stack
                              spacing={2}
                              direction="row"
                              alignItems={"center"}
                              justifyContent="space-between"
                              sx={{ width: "100%" }}
                            >
                              <Stack>
                                <span style={{ fontSize: "12pt" }}>
                                  <strong>{line.description}</strong>
                                </span>
                                <span style={{ fontSize: "10pt" }}>
                                  Qty. {line.quantity}
                                </span>
                              </Stack>
                              <span>
                                {(line.amount / 100).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </span>
                            </Stack>
                          </div>
                        );
                      })}
                  </div>
                  {invoice && (
                    <div className="row">
                      <div
                        className="col-6 col-md-6 my-2"
                        style={{ textAlign: "center" }}
                      >
                        <h5>Balance</h5>
                        <p className="text-black">
                          {(invoice.amount_remaining / 100).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          )}
                        </p>
                      </div>
                      <div
                        className="col-6 col-md-6 my-2"
                        style={{ textAlign: "center" }}
                      >
                        <h5>Amount paid</h5>
                        <p className="text-black">
                          {" "}
                          {(invoice.amount_paid / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="row">
                    {invoice && !invoice.paid ? (
                      <div
                        className=" mb-3"
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
                          <UIButton
                            onClick={() => {
                              window.open(invoice.hosted_invoice_url, "_blank");
                            }}
                            style={{
                              width: "100%",
                              backgroundColor: uiGrey2,
                            }}
                            btnText="View Details"
                          />
                          <UIButton
                            onClick={() => {
                              setOpenPaymentModal(true);
                            }}
                            style={{
                              width: "100%",
                            }}
                            btnText="Pay Now"
                          />
                        </Stack>
                      </div>
                    ) : (
                      <div
                        className="mb-3"
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
                          <UIButton
                            onClick={() => {
                              window.open(invoice.hosted_invoice_url, "_blank");
                            }}
                            style={{
                              width: "100%",
                            }}
                            btnText="Download Invoice"
                          />
                        </Stack>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BillDetail;
