import { useState } from 'react';

const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateInput = (name, value, validations) => {
    let error = '';

    if (validations.required && value.trim() === '') {
      error = 'This field is required.';
    }

    if (validations.regex && !validations.regex.test(value)) {
      error = 'Invalid format.';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = (formData, formInputs) => {
    const newErrors = {};

    formInputs.forEach((input) => {
      if (!input.hide) {
        const { name, validations } = input;
        const value = formData[name];

        validateInput(name, value, validations);

        if (errors[name]) {
          newErrors[name] = errors[name];
        }
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const triggerValidation = (name, value, validations) => {
    validateInput(name, value, validations);
  };

  return { errors, validateForm, triggerValidation };
};

export default useFormValidation;
