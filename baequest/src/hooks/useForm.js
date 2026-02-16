import { useState } from "react";

export function useForm(defaultValues) {
  const [values, setValues] = useState(defaultValues);

  const [errors, setErrors] = useState({});
  let newErrors = {};

  function validate(data) {
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (data.email !== undefined && !emailPattern.test(data.email)) {
      return (newErrors.email =
        "Please provide a valid email (e.g., user@example.com");
    }

    if (data.password !== undefined && !passwordPattern.test(data.password)) {
      return (newErrors.password =
        "Password must be at least 8 characters with one uppercase letter and one number");
    }
    return "";
  }

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [name]: value,
      };

      validate(newValues);

      return newValues;
    });

    setErrors(newErrors);
  };

  const handleReset = () => {
    setValues(defaultValues);
  };

  return { errors, values, handleChange, handleReset, setValues };
}
