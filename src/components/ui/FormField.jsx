import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

function FormField({
  label,
  name,
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  hint,
  required,
  darkMode,
  variant = "default",
  options,
  min,
  max,
  disabled,
  className = "",
}) {
  const showError = touched && error;
  const inputId = `field-${name}`;

  const wrapperClass =
    variant === "auth" ? "form-field form-field-auth" : "form-field";

  const inputClass = [
    variant === "auth" ? "input-auth" : "input",
    Icon ? "input-with-icon" : "",
    options ? "select" : "",
    showError ? "input-error" : touched && value && !error ? "input-success" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${wrapperClass} ${darkMode && variant !== "auth" ? "form-field-dark" : ""}`}>
      <label htmlFor={inputId} className={variant === "auth" ? "label-auth" : "label"}>
        {label}
        {required && (
          <>
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>

      <div className="input-wrapper">
        {Icon && (
          <span className={`input-icon ${showError ? "input-icon-error" : ""}`}>
            <Icon />
          </span>
        )}

        {options ? (
          <select
            id={inputId}
            name={name}
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={() => onBlur?.(name)}
            disabled={disabled}
            className={inputClass}
            aria-required={required ? "true" : undefined}
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={showError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          >
            {options.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={() => onBlur?.(name)}
            disabled={disabled}
            min={min}
            max={max}
            className={inputClass}
            aria-required={required ? "true" : undefined}
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={showError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          />
        )}

        {touched && value && !error && !options && (
          <span className="input-status-icon input-status-success">
            <FaCheckCircle />
          </span>
        )}
      </div>

      {hint && !showError && (
        <p id={`${inputId}-hint`} className="field-hint">
          {hint}
        </p>
      )}

      {showError && (
        <p id={`${inputId}-error`} className="field-error" role="alert">
          <FaExclamationCircle className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
