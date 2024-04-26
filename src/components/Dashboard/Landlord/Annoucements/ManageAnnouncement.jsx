import React, { useState, useEffect } from "react";
import {
  triggerValidation,
  validateInput,
  validateForm,
} from "../../../../helpers/formValidation";
import { useNavigate } from "react-router";
import {
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../../../api/announcements";
import { authenticatedInstance } from "../../../../api/api";
import { authUser, validationMessageStyle } from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIInput from "../../UIComponents/UIInput";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { useParams } from "react-router";
import BackButton from "../../UIComponents/BackButton";
import DeleteButton from "../../UIComponents/DeleteButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
const ManageAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState({});
  const [targetObject, setTargetObject] = useState({});
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalRedirect, setAlertModalRedirect] = useState(
    "/dashboard/landlord/announcements"
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [formData, setFormData] = useState({
    owner: authUser.owner_id,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [progressModalMessage, setProgressModalMessage] = useState("");

  //Error Messages
  const [startDateErrorMessage, setStartDateErrorMessage] = useState("");
  const [endDateErrorMessage, setEndDateErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Name ", name);
    console.log("Value ", value);
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Errors ", errors);
    console.log("Form Data ", formData);
  };

  const formInputs = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: /^(?!\s*$)[\w\s\S]+$/,
        errorMessage: "Enter a valid title",
      },
      dataTestId: "title",
      errorMessageDataTestid: "title-error",
    },
    {
      name: "severity",
      label: "Severity",
      type: "select",
      colSpan: 12,
      options: [
        { label: "Select Severity", value: "" },
        { label: "Normal", value: "success" },
        { label: "Informational", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Critical", value: "error" },
      ],
      placeholder: "Select severity",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: /^(?!\s*$)[\w\s\S]+$/,
        errorMessage: "Select a severity",
      },
      dataTestId: "severity",
      errorMessageDataTestid: "severity-error",
    },
    {
      name: "start_date",
      label: "Announcement Start Date",
      type: "date",
      colSpan: 6,
      placeholder: "Select start date",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: startDateErrorMessage,
        validate: (val) => {
          // Create a new Date object from the date string
          const selectedDate = new Date(val);

          // Extract year, month, and day from the selected date
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with zero if needed
          const day = String(selectedDate.getDate()).padStart(2, "0"); // Pad with zero if needed

          // Format the date components as yyyy-mm-dd
          const formattedDate = `${year}-${month}-${day}`;

          // Get the current date in the local time zone
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

          // Extract year, month, and day from the current date
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed, so add 1
          const currentDay = currentDate.getDate();

          // Compare year, month, and day parts without considering time
          if (
            year < currentYear ||
            (year === currentYear && month < currentMonth) ||
            (year === currentYear && month === currentMonth && day < currentDay)
          ) {
            setStartDateErrorMessage("Start date cannot be in the past");
            return "Start date cannot be in the past";
          } else if (
            formData.end_date &&
            selectedDate > new Date(formData.end_date)
          ) {
            setStartDateErrorMessage("Start date cannot be after the end date");
            return "Start date cannot be greater than end date";
          }
        },
      },
      dataTestId: "start-date",
      errorMessageDataTestid: "start-date-error",
    },
    {
      name: "end_date",
      label: "Announcement End Date",
      type: "date",
      colSpan: 6,
      placeholder: "Select end date",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: endDateErrorMessage,
        validate: (val) => {
          // Create a new Date object from the selected date string
          const selectedDate = new Date(val);

          // Get the current date in the local time zone
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

          // Allow selecting dates starting from today onwards, disallow past dates
          if (selectedDate < currentDate) {
            setEndDateErrorMessage("End date cannot be in the past");
            return "End date cannot be in the past";
          } else if (
            formData.start_date &&
            selectedDate < new Date(formData.start_date)
          ) {
            setEndDateErrorMessage("End date cannot be before the start date");
            return "End date cannot be less than the start date";
          }
        },
      },
      dataTestId: "end-date",
      errorMessageDataTestid: "end-date-error",
    },
    {
      name: "body",
      label: "Message",
      type: "textarea",
      colSpan: 12,
      placeholder: "Enter a Message",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: /^(?!\s*$)[\w\s\S]+$/,
        errorMessage: "Enter a valid body",
      },
      dataTestId: "body",
      errorMessageDataTestid: "body-error",
    },
  ];

  const handleSubmit = async () => {
    setProgressModalMessage("Creating announcement...");
    setLoading(true);
    //Remove rental_property, rental_unit, portfolio from form data
    delete formData.rental_property;
    delete formData.rental_unit;
    delete formData.portfolio;
    const response = await updateAnnouncement(id, formData).then((res) => {
      console.log("Response ", res);
      if (res.status === 200) {
        setLoading(false);
        setFormData({});
        setErrors({});
        setAlertModalTitle("Success");
        setAlertModalMessage("Announcement updated successfully");
        setAlertModalRedirect("/dashboard/landlord/announcements/");
        setAlertModalOpen(true);
      } else {
        setLoading(false);
        setAlertModalTitle("Error");
        setAlertModalMessage("An error occurred while updating announcement");
        setAlertModalRedirect("/dashboard/landlord/announcements/" + id);
        setAlertModalOpen(true);
      }
    });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Ensure month and day are two digits
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    getAnnouncement(id).then((res) => {
      // Convert date strings to Date objects for date inputs
      res.start_date = new Date(res.start_date);
      res.end_date = new Date(res.end_date);

      setAnnouncement(res);
      setTargetObject(res.target_object);
      setFormData((prevData) => ({ ...prevData, ...res }));
    });
  }, []);

  return (
    <div className="container-fluid">
      <BackButton />
      <ProgressModal open={loading} message={progressModalMessage} />
      <AlertModal
        open={alertModalOpen}
        title={alertModalTitle}
        message={alertModalMessage}
        onClose={() => setAlertModalOpen(false)}
        onClick={() => {
          navigate(alertModalRedirect);
          setAlertModalOpen(false);
        }}
        btnText="Okay"
      />
      <ConfirmModal
        open={confirmModalOpen}
        title={confirmModalTitle}
        message={confirmModalMessage}
        handleClose={() => setConfirmModalOpen(false)}
        cancelBtnText="Cancel"
        handleCancel={() => setConfirmModalOpen(false)}
        confirmBtnText="Yes"
        handleConfirm={() => {
          setConfirmModalOpen(false);
          // Call the delete function here
          deleteAnnouncement(id).then((res) => {
            console.log("Delete response ", res);
            navigate("/dashboard/landlord/announcements");
          });
        }}
      />
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-black">
            Manage Announcement for
            {targetObject && `${targetObject.type + " " + targetObject.name}`}
          </h4>
          <form>
            <div className="row">
              <div className="col-md-12">
                <label className="text-black" style={{ display: "block" }}>
                  {announcement.rental_property && "Renting Property: "}
                  {announcement.rental_unit && "Rental Unit"}
                  {announcement.portfolio && "Portfolio"}
                </label>
                <p className="text-black">
                  {announcement.rental_property &&
                    announcement.rental_property.name}
                  {announcement.rental_unit && announcement.rental_unit.name}
                  {announcement.portfolio && announcement.portfolio.name}
                </p>
              </div>
              {formInputs.map((input, index) => {
                return (
                  <>
                    {input.type === "select" && (
                      <div
                        className={`col-md-${input.colSpan} mb-2`}
                        key={index}
                      >
                        <label
                          className="text-black mb-1"
                          style={{ display: "block" }}
                        >
                          {input.label}
                        </label>
                        <select
                          name={input.name}
                          className="form-control"
                          onChange={input.onChange}
                          value={formData[input.name]}
                          data-testId={input.dataTestId}
                        >
                          <option value="">Select One</option>
                          {input.options.map((option, index) => {
                            return (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            );
                          })}
                        </select>
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{
                              ...validationMessageStyle,
                              display: "block",
                            }}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    )}
                    {input.type === "text" && (
                      <div
                        className={`col-md-${input.colSpan} mb-2`}
                        key={index}
                      >
                        <UIInput
                          name={input.name}
                          label={input.label}
                          type={input.type}
                          placeholder={input.placeholder}
                          onChange={input.onChange}
                          defaultValue={formData[input.name]}
                          error={errors[input.name]}
                          dataTestId={input.dataTestId}
                          errorMessageDataTestid={input.errorMessageDataTestid}
                        />
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{
                              ...validationMessageStyle,
                              display: "block",
                            }}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    )}
                    {input.type === "date" && (
                      <div
                        className={`col-md-${input.colSpan} mb-2`}
                        key={index}
                      >
                        <label
                          className="text-black mb-1"
                          style={{ display: "block" }}
                        >
                          {input.label}
                        </label>
                        <input
                          className="form-control"
                          name={input.name}
                          label={input.label}
                          type={input.type}
                          placeholder={input.placeholder}
                          onChange={input.onChange}
                          value={formatDate(new Date(formData[input.name]))}
                          error={errors[input.name]}
                          dataTestId={input.dataTestId}
                          errorMessageDataTestid={input.errorMessageDataTestId}
                        />
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{
                              ...validationMessageStyle,
                              display: "block",
                            }}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    )}

                    {input.type === "textarea" && (
                      <div className={`col-md-${input.colSpan}`} key={index}>
                        <div>
                          <label
                            className="text-black mb-1"
                            style={{ display: "block" }}
                          >
                            {input.label}
                          </label>
                        </div>
                        <textarea
                          name={input.name}
                          placeholder={input.placeholder}
                          value={formData[input.name]}
                          onChange={input.onChange}
                          className="form-control"
                          style={{ height: "100px" }}
                        />
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={validationMessageStyle}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                );
              })}
            </div>
            <UIButton
              dataTestId="create-announcement"
              onClick={() => {
                console.log("Form data ", formData);
                const { isValid, newErrors } = validateForm(
                  formData,
                  formInputs
                );
                console.log("isValid ", isValid);
                console.log("newErrors ", newErrors);
                if (!isValid) {
                  setErrors(newErrors);
                  return;
                } else {
                  handleSubmit();
                }
              }}
              btnText="Update Announcement"
              style={{ margin: "10px 0", width: "100%" }}
            />
          </form>
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <DeleteButton
          style={{ margin: "10px 0", float: "right" }}
          btnText="Delete Announcement"
          onClick={() => {
            setConfirmModalTitle("Delete Announcement");
            setConfirmModalMessage(
              "Are you sure you want to delete this announcement?"
            );
            setConfirmModalOpen(true);
          }}
        />
      </div>
    </div>
  );
};

export default ManageAnnouncement;
