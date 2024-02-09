import React, { useState } from "react";
import { requestDemo } from "../../../../api/mailchimp";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import UIButton from "../../../Dashboard/UIComponents/UIButton";
import AlertModal from "../../../Dashboard/UIComponents/Modals/AlertModal";
import { Stack } from "@mui/material";
const CallToActionForm = (props) => {
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
    try {
      const res = await requestDemo(data).then((res) => {
        console.log(res);
        if (res.status === 200) {
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
      console.log(error);
      setModalTitle("Error!");
      setModalMessage(
        "Something went wrong. Please try  using a  different email address or try again later."
      );
      setShowModal(true);
    }
  };
  return (
    <div>
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
          direction="row"
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
            />
            <span className={validationMessageStyle}>
              {errors.email && errors.email.message}
            </span>
          </div>
          <div className="">
            <UIButton type="submit" btnText="Request Demo" />
          </div>
        </Stack>
      </form>
    </div>
  );
};

export default CallToActionForm;
