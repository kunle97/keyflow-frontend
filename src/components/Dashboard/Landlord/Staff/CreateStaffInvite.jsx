import React, { useState, useEffect } from "react";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import { createStaffInvite } from "../../../../api/staff_invites";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIButton from "../../UIComponents/UIButton";
import { useNavigate } from "react-router";
const CreateStaffInvite = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/staff/${rowData}/`;
    navigate(navlink);
  };
  //Create formInputs array for frst_name, last_name, email, and role
  const formInputs = [
    {
      name: "first_name",
      label: "First Name",
      colSpan: 6,
      placeholder: "John",
      onChange: (e) => handleChange(e),
      type: "text",
      validations: {
        required: true,
        regex: /^[a-zA-Z\s]*$/,
        errorMessage: "First name is required",
      },
      dataTetId: "invite-staff-first-name-input",
      errorMessageTestId: "invite-staff-first-name-error",
    },
    {
      name: "last_name",
      label: "Last Name",
      colSpan: 6,
      placeholder: "Doe",
      onChange: (e) => handleChange(e),
      type: "text",
      validations: {
        required: true,
        regex: /^[a-zA-Z\s]*$/,
        errorMessage: "Last name is required",
      },
      dataTetId: "invite-staff-last-name-input",
      errorMessageTestId: "invite-staff-last-name-error",
    },
    {
      name: "email",
      label: "E-mail",
      colSpan: 6,
      placeholder: "jdoe@email.com",
      onChange: (e) => handleChange(e),
      type: "email",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        errorMessage: "Email is required",
      },
      dataTetId: "invite-staff-email-input",
      errorMessageTestId: "invite-staff-email-error",
    },
    {
      name: "role",
      label: "Role",
      colSpan: 6,
      placeholder: "Property Manager, Accountant, etc.",
      onChange: (e) => handleChange(e),
      type: "text",
      validations: {
        required: true,
        regex: /^[a-zA-Z\s]*$/,
        errorMessage: "Role is required",
      },
      dataTetId: "invite-staff-role-input",
      errorMessageTestId: "invite-staff-role-error",
    },
  ];
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, newErrors } = validateForm(formData, formInputs);
    if (!isValid) {
      setErrors(newErrors);
    } else {
      //Call the createStaffInvite function from the API
      createStaffInvite(formData).then((res) => {
        if (res.status === 200) {
          setAlertTitle("Staff Invite Created");
          setAlertMessage("Staff invite created successfully");
          setAlertOpen(true);
        } else {
          setAlertTitle("Error");
          setAlertMessage("An error occurred. Please try again");
          setAlertOpen(true);
        }
      });
    }
  };
  return (
    <div className="container">
      <AlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
        onClick={() => {
          setAlertOpen(false);
          navigate("/dashboard/landlord/staff-invites/");
        }}
      />
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-black">Create Staff Invite</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              {formInputs.map((input, index) => (
                <div key={index} className={`col-md-${input.colSpan} mb-3`}>
                  <label className="form-label text-black" htmlFor={input.name}>
                    <strong>{input.label}</strong>
                  </label>
                  <input
                    {...input}
                    className="form-control text-black"
                    id={input.name}
                  />
                  {errors[input.name] && (
                    <p
                      data-testid={input.errorMessageTestId}
                      className="text-danger"
                    >
                      {errors[input.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <UIButton
              style={{ width: "100%" }}
              type="submit"
              className="btn btn-primary"
              btnText="Create Staff Invite"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStaffInvite;
