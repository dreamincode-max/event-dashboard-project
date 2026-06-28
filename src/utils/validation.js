export const rules = {
  required: (value, message = "This field is required") => {
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "");
    return empty ? message : "";
  },

  email: (value, message = "Enter a valid email address") => {
    if (!value) return "";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    return ok ? "" : message;
  },

  minLength: (min, message) => (value) => {
    if (!value) return "";
    return value.trim().length >= min
      ? ""
      : message || `Must be at least ${min} characters`;
  },

  password: (value, message = "Password must be at least 6 characters") => {
    if (!value) return "";
    return value.length >= 6 ? "" : message;
  },

  phone: (value, message = "Enter a valid phone number (10+ digits)") => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 ? "" : message;
  },

  number: (value, message = "Enter a valid number") => {
    if (value === "" || value === undefined || value === null) return "";
    const num = Number(value);
    return !Number.isNaN(num) && num >= 0 ? "" : message;
  },

  date: (value, message = "Select a valid date") => {
    if (!value) return "";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? message : "";
  },
};

export function validateFields(values, schema) {
  const errors = {};
  Object.entries(schema).forEach(([field, validators]) => {
    for (const validator of validators) {
      const error = validator(values[field], values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  return errors;
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}
