export const validateInput = (name, value, validations) => {
  let errors = { ...validations.errorMessage };
  console.log(
    "Name ",
    name,
    " Value ",
    value,
    " Required",
    validations.required
  );

  if (validations.required) {
    if (
      value === null ||
      value === undefined ||
      value.toString().trim() === ""
    ) {
      errors[name] = validations.errorMessage
        ? validations.errorMessage
        : "This field is required.";
    } else if (validations.regex && !validations.regex.test(value)) {
      errors[name] = validations.errorMessage;
    } else if (validations.validate && validations.validate(value)) {
      errors[name] = validations.errorMessage;
    } else {
      errors[name] = undefined; // Set to undefined instead of deleting
    }
  }

  return errors;
};

export const validateForm = (formData, formInputs) => {
  const newErrors = {};

  formInputs.forEach((input) => {
    if (!input.hide || input.required) {
      const { name, validations } = input;
      const value = formData[name];

      newErrors[name] = validateInput(name, value, validations)[name];
    }
  });
  let isValid = Object.values(newErrors).every((error) => error === undefined);
  return { isValid, newErrors };
};

export const triggerValidation = (name, value, validations) => {
  return validateInput(name, value, validations);
};

//Create a function to check to see if there are any errors in the errors object
export const hasNoErrors = (errors) => {
  return Object.values(errors).every((val) => val === undefined);
};
