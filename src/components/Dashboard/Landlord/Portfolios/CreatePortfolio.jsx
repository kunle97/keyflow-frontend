import React, { useState } from "react";
import { useNavigate } from "react-router";
import { set, useForm } from "react-hook-form";
import {
  authUser,
  defaultWhiteInputStyle,
  uiGrey,
} from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import { createPortfolio } from "../../../../api/portfolios";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import useScreen from "../../../../hooks/useScreen";
const CreatePortfolio = () => {
  const navigate = useNavigate();
  const { isMobile, screenWidth, breakpoints } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    data.owner = authUser.owner_id;

    // navigate("/dashboard/landlord/portfolios");
    createPortfolio(data)
      .then((res) => {
        console.log(res);
        if (res.status === 200 || res.status === 201) {
          setAlertTitle("Success");
          setAlertMessage("Portfolio Created Successfully");
          setOpen(true);
        } else {
          setAlertTitle("Error");
          setAlertMessage("Error Creating Portfolio");
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlertTitle("Error");
        setAlertMessage("Error Creating Portfolio. " + err.message);
      })
      .finally(() => {
        console.log("finally");
      });
  };
  return (
    <div
      className={`${screenWidth > breakpoints.md && "container-fluid "} pt-4`}
    >
      <ProgressModal open={isLoading} title={"Creating Portfolio..."} />
      <AlertModal
        open={open}
        setOpen={setOpen}
        title={alertTitle}
        message={alertMessage}
        btnText={"Ok"}
        onClick={() => navigate("/dashboard/landlord/portfolios")}
      />
      <h4>Create Portfolio</h4>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-4">
              <label className="text-black" htmlFor="name">
                Name
              </label>
              <input
                style={{ ...defaultWhiteInputStyle, background: uiGrey }}
                type="text"
                id="name"
                {...register("name", { required: true })}
              />
              {errors.name && <span>This field is required</span>}
            </div>

            <div className="form-group mb-4">
              <label className="text-black" htmlFor="description">
                Description
              </label>
              <textarea
                style={{ ...defaultWhiteInputStyle, background: uiGrey }}
                type="text"
                id="description"
                {...register("description", { required: true })}
              ></textarea>
            </div>
            <UIButton
              type="submit"
              btnText="Create"
              buttonStyle="btnGreen"
              style={{ float: "right", width: isMobile ? "100%" : "auto" }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;
