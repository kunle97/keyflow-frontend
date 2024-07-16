import React, { useEffect, useState } from "react";
import UIButton from "../../../../../UIComponents/UIButton";
import ConfirmModal from "../../../../../UIComponents/Modals/ConfirmModal";
import {
  authUser,
  token,
  uiGreen,
  uiRed,
  validationMessageStyle,
} from "../../../../../../../constants";
import UIPrompt from "../../../../../UIComponents/UIPrompt";
import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import { Paper, Popper } from "@material-ui/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router";
import {
  deleteStripePaymentMethod,
  listOwnerStripePaymentMethods,
  setOwnerDefaultPaymentMethod,
} from "../../../../../../../api/payment_methods";
import AddCardIcon from "@mui/icons-material/AddCard";
import UIDialog from "../../../../../UIComponents/Modals/UIDialog";
import AddPaymentMethod from "../../../../../AddPaymentMethod";
import AlertModal from "../../../../../UIComponents/Modals/AlertModal";
import CreditCardIcon from "@mui/icons-material/CreditCard";
const PaymentMethodsSection = () => {
  const navigate = useNavigate();
  const [openAddPaymentMethodModal, setOpenAddPaymentMethodModal] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentMethodDeleteId, setPaymentMethodDeleteId] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodDefaultId, setPaymentMethodDefaultId] = useState(null);
  const [showDefaultConfirm, setShowDefaultConfirm] = useState(false);
  const [updatedDefaultPaymentMethod, setUpdatedDefaultPaymentMethod] =
    useState(null);

  const [openContextMenu, setOpenContextMenu] = useState(false);
  const anchorRef = React.useRef(null);
  // Dropdown
  const handleToggle = () => {
    setOpenContextMenu((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
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
    console.log("Set as default PM: ", paymentMethodId);
    let data = {};
    data.payment_method_id = paymentMethodId;
    data.user_id = authUser.id;
    setOwnerDefaultPaymentMethod(data)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setResponseTitle("Alert");
          setResponseMessage("Payment method set as default");
          //Get the payment methods for the user
          listOwnerStripePaymentMethods(`${authUser.id}`).then((res) => {
            setPaymentMethods(res.payment_methods.data);
          });
          setPaymentMethodDefaultId(paymentMethodId);
        } else {
          setResponseTitle("Error");
          setResponseMessage("Error setting payment method as default");
        }
      })
      .catch((error) => {
        setResponseTitle("Error");
        setResponseMessage("Error setting payment method as default");
      })
      .finally(() => {
        setIsLoading(false);
        setShowResponseModal(true);
      });
  };
  const handlePaymentMethodDelete = (paymentMethodId) => {
    console.log("Deleted PM: ", paymentMethodId);
    let data = {
      payment_method_id: paymentMethodId,
    };
    deleteStripePaymentMethod(data).then((res) => {
      console.log(res);
      setResponseTitle("Alert");
      setResponseMessage("Payment method deleted");
      setShowResponseModal(true);
      //Get the payment methods for the user
      listOwnerStripePaymentMethods(`${authUser.id}`).then((res) => {
        console.log(res.data);
        setPaymentMethods(res.payment_methods.data);
      });
    });
  };
  useEffect(() => {
    //Get the payment methods for the user
    listOwnerStripePaymentMethods(`${authUser.id}`)
      .then((res) => {
        console.log("PAyment M3th0Ds Response: ", res);
        setPaymentMethods(res.payment_methods.data);
        setPaymentMethodDefaultId(res.default_payment_method);
      })
      .catch((error) => {
        console.log("Error getting payment methods: ", error);
        setPaymentMethods([]);
      });
  }, []);
  return (
    <div>
      <AlertModal
        open={showResponseModal}
        title={responseTitle}
        message={responseMessage}
        btnText="Okay"
        onClick={() => setShowResponseModal(false)}
      />{" "}
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
              handleSetDefaultPaymentMethod(updatedDefaultPaymentMethod);
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
              handlePaymentMethodDelete(paymentMethodDeleteId);
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
                <div className="col-sm-12 col-md-6  mb-3">
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
                            <img src={cardImageSrc} width={50} />
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
                            <span className="text-black">
                              •••• •••• •••• {paymentMethod.card.last4}
                            </span>
                            <span className="text-muted">
                              Expires {paymentMethod.card.exp_month}/
                              {paymentMethod.card.exp_year}
                            </span>
                          </Stack>
                        </Stack>
                        <div className="menu-button-container">
                          <IconButton
                            ref={anchorRef}
                            id={`composition-button-${index}`}
                            aria-controls={
                              openContextMenu ? `composition-menu-${index}` : undefined
                            }
                            aria-expanded={openContextMenu ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Popper
                            open={openContextMenu}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            sx={{ zIndex: 1300 }} // Ensure Popper is on top
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === "bottom-start"
                                      ? "right top"
                                      : "right top",
                                }}
                              >
                                <Paper
                                  sx={{
                                    borderRadius: "0px",
                                    boxShadow:
                                      "0px 0px 10px 0px rgba(0,0,0,0.1)",
                                    zIndex: "1300000 !important",
                                  }}
                                >
                                  <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                      autoFocusItem={openContextMenu}
                                      id={`composition-menu-${index}`}
                                      aria-labelledby={`composition-button-${index}`}
                                      onKeyDown={handleListKeyDown}
                                      sx={{ zIndex: "1300000 !important" }}
                                    >
                                      <MenuItem
                                        onClick={() => {
                                          handleSetDefaultPaymentMethod(
                                            paymentMethod.id
                                          );
                                          setOpenContextMenu(false);
                                        }}
                                      >
                                        Set As Default
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          setPaymentMethodDeleteId(
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
                          </Popper>
                        </div>
                      </Stack>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <UIPrompt
              icon={<AddCardIcon sx={{ fontSize: "30pt", color: uiGreen }} />}
              title="No payment methods found"
              message="You have not added any payment methods yet"
              body={
                <UIButton
                  onClick={() => navigate("/dashboard/add-payment-method")}
                  btnText="Add Payment Method"
                />
              }
            />
          )}
        </div>
      </>
    </div>
  );
};

export default PaymentMethodsSection;
