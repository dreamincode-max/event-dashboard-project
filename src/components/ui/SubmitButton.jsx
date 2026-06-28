import { FaSpinner } from "react-icons/fa";

function SubmitButton({
  loading,
  children,
  loadingText = "Please wait…",
  className = "btn btn-primary",
  disabled,
  type = "submit",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`${className} ${loading ? "btn-loading" : ""}`}
      {...props}
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default SubmitButton;
