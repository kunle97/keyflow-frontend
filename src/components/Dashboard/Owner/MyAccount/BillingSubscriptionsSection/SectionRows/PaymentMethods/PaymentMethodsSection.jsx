import React, { useEffect, useState } from "react";
import UIButton from "../../../../../UIComponents/UIButton";
import ConfirmModal from "../../../../../UIComponents/Modals/ConfirmModal";
import { authUser, uiGreen, uiRed } from "../../../../../../../constants";
import UIPrompt from "../../../../../UIComponents/UIPrompt";
import {
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import { Paper, Popper } from "@material-ui/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router";
import {
  createBillingPortalSession,
  deleteStripePaymentMethod,
  listOwnerStripePaymentMethods,
  setOwnerDefaultPaymentMethod,
} from "../../../../../../../api/payment_methods";
import AddCardIcon from "@mui/icons-material/AddCard";
import UIDialog from "../../../../../UIComponents/Modals/UIDialog";
import AddPaymentMethod from "../../../../../AddPaymentMethod";
import AlertModal from "../../../../../UIComponents/Modals/AlertModal";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ProgressModal from "../../../../../UIComponents/Modals/ProgressModal";

const PaymentMethodsSection = () => {
  const navigate = useNavigate();
  const [openAddPaymentMethodModal, setOpenAddPaymentMethodModal] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("Please wait...");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodDefaultId, setPaymentMethodDefaultId] = useState(null);
  const [showDefaultConfirm, setShowDefaultConfirm] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [openContextMenu, setOpenContextMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleToggle = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenContextMenu((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorEl && anchorEl.contains(event.target)) {
      return;
    }

    setOpenContextMenu(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenContextMenu(false);
    } else if (event.key === "Escape") {
      setOpenContextMenu(false);
    }
  }

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    setIsLoading(true);
    setProgressMessage("Setting as default payment method...");

    let data = {
      payment_method_id: paymentMethodId,
      user_id: authUser.id,
    };

    try {
      const res = await setOwnerDefaultPaymentMethod(data);
      if (res.status === 200) {
        setResponseTitle("Alert");
        setResponseMessage("Payment method set as default");

        const paymentMethodsResponse = await listOwnerStripePaymentMethods(
          `${authUser.id}`
        );
        setPaymentMethods(paymentMethodsResponse.payment_methods.data);
        setPaymentMethodDefaultId(paymentMethodId);
      } else {
        setResponseTitle("Error");
        setResponseMessage("Error setting payment method as default");
      }
    } catch (error) {
      setResponseTitle("Error");
      setResponseMessage("Error setting payment method as default");
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const handlePaymentMethodDelete = (paymentMethodId) => {
    let data = {
      payment_method_id: paymentMethodId,
    };
    deleteStripePaymentMethod(data).then((res) => {
      setResponseTitle("Alert");
      setResponseMessage("Payment method deleted");
      setShowResponseModal(true);
      //Get the payment methods for the user
      listOwnerStripePaymentMethods(`${authUser.id}`).then((res) => {
        setPaymentMethods(res.payment_methods.data);
      });
    });
  };

  useEffect(() => {
    //Get the payment methods for the user
    listOwnerStripePaymentMethods(`${authUser.id}`)
      .then((res) => {
        setPaymentMethods(res.payment_methods.data);
        setPaymentMethodDefaultId(res.default_payment_method);
      })
      .catch((error) => {
        setPaymentMethods([]);
      });
  }, [selectedPaymentMethodId]);

  return (
    <div>
      <AlertModal
        open={showResponseModal}
        title={responseTitle}
        message={responseMessage}
        btnText="Okay"
        onClick={() => setShowResponseModal(false)}
      />{" "}
      <ProgressModal open={isLoading} title={progressMessage} />
      <>
        <div className="row">
          <ConfirmModal
            open={showDefaultConfirm}
            handleClose={() => setShowDefaultConfirm(false)}
            title="Set As Default Payment Method"
            message="Are you sure you want to set this as your default payment method?"
            cancelBtnText="Cancel"
            confirmBtnText="Set As Default"
            handleConfirm={() => {
              handleSetDefaultPaymentMethod(selectedPaymentMethodId);
              setShowDefaultConfirm(false);
            }}
            handleCancel={() => setShowDefaultConfirm(false)}
          />
          <UIDialog
            title="Add Payment Method"
            open={openAddPaymentMethodModal}
            onClose={() => setOpenAddPaymentMethodModal(false)}
          >
            <div
              style={{
                width: "550px",
              }}
            >
              <AddPaymentMethod
                hideBackButton={true}
                hideBoxShaddow={true}
                hideTitle={true}
                returnTo="/dashboard/owner/my-account"
              />
            </div>
          </UIDialog>
          <ConfirmModal
            open={showDeleteConfirm}
            handleClose={() => setShowDeleteConfirm(false)}
            title="Delete Payment Method"
            message="Are you sure you want to delete this payment method?"
            cancelBtnText="Cancel"
            confirmBtnText="Delete"
            confirmBtnStyle={{ backgroundColor: uiRed }}
            cancelBtnStyle={{ backgroundColor: uiGreen }}
            handleConfirm={() => {
              handlePaymentMethodDelete(selectedPaymentMethodId);
              setShowDeleteConfirm(false);
            }}
            handleCancel={() => setShowDeleteConfirm(false)}
          />
          {paymentMethods.length > 0 ? (
            paymentMethods.map((paymentMethod, index) => {
              let cardImageSrc = "/assets/img/cards/visa.png";
              if (paymentMethod.card.brand === "visa") {
                cardImageSrc = "/assets/img/cards/visa.png";
              } else if (paymentMethod.card.brand === "mastercard") {
                cardImageSrc = "/assets/img/cards/mastercard.png";
              } else if (paymentMethod.card.brand === "amex") {
                cardImageSrc = "/assets/img/cards/amex.png";
              } else if (paymentMethod.card.brand === "discover") {
                cardImageSrc = "/assets/img/cards/discover.png";
              } else if (paymentMethod.card.brand === "jcb") {
                cardImageSrc = "/assets/img/cards/jcb.png";
              } else if (paymentMethod.card.brand === "unionpay") {
                cardImageSrc = "/assets/img/cards/unionpay.png";
              } else if (paymentMethod.card.brand === "diners") {
                cardImageSrc = "/assets/img/cards/diners.png";
              } else {
                cardImageSrc = null;
              }
              return (
                <div className="col-sm-12 col-md-6 mb-3" key={index}>
                  <div className="card" style={{ width: "100%" }}>
                    <div className="card-body">
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          my: 1,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          spacing={1}
                          sx={{
                            my: 1,
                          }}
                        >
                          {cardImageSrc ? (
                            <img src={cardImageSrc} width={50} alt="card" />
                          ) : (
                            <CreditCardIcon
                              sx={{ color: uiGreen, fontSize: "35pt" }}
                            />
                          )}
                          <Stack
                            direction={"column"}
                            justifyContent={"flex-start"}
                            alignItems={"flex-start"}
                            spacing={0}
                          >
                            <Stack
                              direction="row"
                              justifyContent={"flex-start"}
                              alignItems={"center"}
                              spacing={1}
                              sx={{
                                my: 1,
                              }}
                            >
                              <p
                                style={{
                                  padding: 0,
                                  fontSize: "10pt",
                                  fontWeight: "bold",
                                  color: "black",
                                }}
                              >
                                {" "}
                                {paymentMethod.card.brand.toUpperCase()}{" "}
                              </p>
                              <p
                                style={{
                                  padding: 0,
                                  fontSize: "10pt",
                                  color: "black",
                                }}
                              >
                                **** **** **** {paymentMethod.card.last4}{" "}
                              </p>
                              {paymentMethodDefaultId === paymentMethod.id ? (
                                <p
                                  style={{
                                    padding: 0,
                                    fontSize: "10pt",
                                    color: uiGreen,
                                  }}
                                >
                                  {" "}
                                  Default{" "}
                                </p>
                              ) : (
                                <></>
                              )}
                            </Stack>
                            <p
                              style={{
                                margin: 0,
                                padding: 0,
                                fontSize: "10pt",
                                color: "black",
                              }}
                            >
                              Exp {paymentMethod.card.exp_month}/
                              {paymentMethod.card.exp_year}
                            </p>
                          </Stack>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent={"flex-start"}
                          alignItems={"center"}
                          spacing={1}
                          sx={{
                            my: 1,
                          }}
                        >
                          {/* <IconButton
                            ref={anchorEl}
                            aria-controls={
                              openContextMenu ? "context-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={openContextMenu ? "true" : undefined}
                            onClick={(event) => handleToggle(event)}
                            style={{
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <MoreVertIcon sx={{ color: uiGreen }} />
                          </IconButton>
                          <Popper
                            open={openContextMenu}
                            anchorEl={anchorEl}
                            role={undefined}
                            placement="bottom-end"
                            transition
                            // disablePortal
                            sx={{ zIndex: 1300 }} // Ensure Popper is on top
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === "bottom-end"
                                      ? "left top"
                                      : "left bottom",
                                }}
                              >
                                <Paper>
                                  <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                      autoFocusItem={openContextMenu}
                                      id="context-menu"
                                      aria-labelledby="more-options-button"
                                      onKeyDown={handleListKeyDown}
                                    >
                                      <MenuItem
                                        onClick={() => {
                                          setSelectedPaymentMethodId(
                                            paymentMethod.id
                                          );
                                          setShowDefaultConfirm(true);
                                          setOpenContextMenu(false);
                                        }}
                                      >
                                        Set As Default
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          setSelectedPaymentMethodId(
                                            paymentMethod.id
                                          );
                                          setShowDeleteConfirm(true);
                                          setOpenContextMenu(false);
                                        }}
                                      >
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper> */}
                        </Stack>
                      </Stack>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <UIPrompt
              title="No payment methods"
              description="You have not added any payment methods."
              action={() => {
                setOpenAddPaymentMethodModal(true);
              }}
              actionText={"Add a Payment Method"}
              actionIcon={<AddCardIcon />}
            />
          )}
        </div>
      </>
    </div>
  );
};

export default PaymentMethodsSection;
