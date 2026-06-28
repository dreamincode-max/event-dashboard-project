import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function FormAlert({ message, variant = "auth" }) {
  if (!message) return null;

  const isError = message.type === "error";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={`form-alert ${isError ? "form-alert-error" : "form-alert-success"} ${
          variant === "auth" ? "form-alert-auth" : ""
        }`}
        role="alert"
      >
        {isError ? <FaExclamationCircle /> : <FaCheckCircle />}
        <span>{message.text}</span>
      </motion.div>
    </AnimatePresence>
  );
}

export default FormAlert;
