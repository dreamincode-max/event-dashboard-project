import { useState, useCallback, useRef, useEffect } from "react";
import { validateFields, hasErrors } from "../utils/validation";

export function useForm(initialValues, schema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const validate = useCallback(
    (vals) => validateFields(vals, schema),
    [schema]
  );

  const setField = (name, value) => {
    if (formMessage) setFormMessage(null);
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      valuesRef.current = next;
      if (touched[name]) {
        const fieldErrors = validate(next);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: fieldErrors[name] || "",
        }));
      }
      return next;
    });
  };

  const blurField = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(valuesRef.current);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || "",
    }));
  };

  const resetForm = (newValues = initialValues) => {
    setValues(newValues);
    valuesRef.current = newValues;
    setErrors({});
    setTouched({});
    setFormMessage(null);
    setSubmitting(false);
  };

  const handleSubmit = (onValid) => async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(schema).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const currentValues = valuesRef.current;
    const nextErrors = validate(currentValues);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setFormMessage({
        type: "error",
        text: "Please fix the highlighted fields before submitting.",
      });
      return;
    }

    setSubmitting(true);
    setFormMessage(null);

    try {
      await onValid(currentValues);
    } catch (err) {
      setFormMessage({
        type: "error",
        text: err?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const setValuesWithRef = (newValues) => {
    valuesRef.current = newValues;
    setValues(newValues);
  };

  return {
    values,
    errors,
    touched,
    submitting,
    formMessage,
    setFormMessage,
    setField,
    blurField,
    resetForm,
    handleSubmit,
    setValues: setValuesWithRef,
  };
}
