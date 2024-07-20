import React, { useState } from "react";
import { requestDemo } from "../../../../api/mailchimp";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import UIButton from "../../../Dashboard/UIComponents/UIButton";
import AlertModal from "../../../Dashboard/UIComponents/Modals/AlertModal";
import { Stack } from "@mui/material";
import ReactGA from "react-ga4";
import ProgresModal from "../../../Dashboard/UIComponents/Modals/ProgressModal";
import useScreen from "../../../../hooks/useScreen";
const CallToActionForm = () => {
  ReactGA.initialize([
    {
      trackingId: "G-Z7X45HF5K6",
    },
  ]);
  const { isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await requestDemo(data).then((res) => {

        if (res.status === 200) {
          ReactGA.event({
            category: "Mailing List",
            action: "mailing_list_signup",
            label: "Mailing List Sign Up from Demo Request",
          });
          setModalTitle("Success!");
          setModalMessage(
            "Thank you for your interest in KeyFlow! We will be in touch shortly."
          );
          setShowModal(true);
          reset();
        } else {
          setModalTitle("Error!");
          setModalMessage("Something went wrong. Please try again later.");
          setShowModal(true);
        }
      });
    } catch (error) {

      setModalTitle("Error!");
      setModalMessage(
        "Something went wrong. Please try  using a  different email address or try again later."
      );
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <ProgresModal open={isLoading} title="Please wait..." />
      <AlertModal
        title={modalTitle}
        message={modalMessage}
        open={showModal}
        onClick={() => setShowModal(false)}
        btnText="Okay"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex justify-content-center flex-wrap"
        method="post"
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {" "}
          <div className="">
            <input
              {...register("email", {
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
              className="form-control"
              type="email"
              name="email"
              placeholder="Your Email"
              style={{ width: "250px" }}
              required
            />
            <span
              className={{
                ...validationMessageStyle,
                width: "100%",
                color: "red",
              }}
            >
              {errors.email && errors.email.message}
            </span>
          </div>
          <div className="" style={{ width: isMobile ? "100%" : "auto" }}>
            <UIButton
              type="submit"
              btnText="Request Demo"
              style={{ width: isMobile ? "100%" : "auto" }}
            />
          </div>
        </Stack>
      </form>
    </div>
  );
};

export default CallToActionForm;
