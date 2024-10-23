export const validateInput = async (name, value, validations) => {
  let errors = {};

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
    } else if (validations.validate) {
      // Await the result of the async validation
      let validationMessage = await validations.validate(value);
      if (validationMessage) {
        errors[name] = validationMessage;
      } else {
        errors[name] = undefined; // Clear any errors if validation passes
      }
    } else {
      errors[name] = undefined;
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
export const triggerValidation = async (name, value, validations) => {
  return await validateInput(name, value, validations);
};

//Create a function to check to see if there are any errors in the errors object
export const hasNoErrors = (errors) => {
  return Object.values(errors).every((val) => val === undefined);
};
