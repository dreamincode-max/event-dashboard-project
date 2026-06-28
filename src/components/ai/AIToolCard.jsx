import { motion, AnimatePresence } from "framer-motion";
import { FaCopy, FaMagic } from "react-icons/fa";
import { toast } from "react-toastify";
import FormField from "../ui/FormField";
import SubmitButton from "../ui/SubmitButton";

function AIToolCard({
  icon: Icon,
  title,
  description,
  fields,
  formData,
  onFormChange,
  onFormBlur,
  fieldErrors = {},
  fieldTouched = {},
  onGenerate,
  result,
  source,
  loading,
  darkMode,
  extraActions,
  generateLabel = "Generate with AI",
  topSlot,
  formError,
}) {
  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 sm:p-8 ${darkMode ? "card-dark" : ""}`}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <Icon className="text-white" />
        </div>
        <div>
          <h3 className={`font-display text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            {title}
          </h3>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {description}
          </p>
        </div>
      </div>

      {topSlot && <div className="mb-5">{topSlot}</div>}

      {formError && (
        <div className="form-alert form-alert-error mb-4" role="alert">
          {formError}
        </div>
      )}

      <div className="form-grid form-grid-sm-2 mb-5">
        {fields.map(
          ({
            name,
            label,
            type = "text",
            placeholder,
            options,
            icon,
            hint,
            required,
          }) => (
            <div key={name} className={options ? "form-grid-span-2-sm" : ""}>
              <FormField
                darkMode={darkMode}
                label={label}
                name={name}
                type={type}
                icon={icon}
                placeholder={placeholder}
                options={options}
                hint={hint}
                required={required}
                value={formData[name]}
                onChange={onFormChange}
                onBlur={onFormBlur}
                error={fieldErrors[name]}
                touched={fieldTouched[name]}
              />
            </div>
          )
        )}
      </div>

      <SubmitButton
        type="button"
        onClick={onGenerate}
        loading={loading}
        loadingText="Generating…"
        className="btn btn-primary"
      >
        <FaMagic /> {generateLabel}
      </SubmitButton>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                  AI Output
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    source === "mock"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  }`}
                >
                  {source === "mock" ? "Demo" : source}
                </span>
              </div>
              <div className="flex gap-2">
                {extraActions}
                <button type="button" onClick={copyResult} className="btn btn-secondary btn-sm">
                  <FaCopy /> Copy
                </button>
              </div>
            </div>
            <pre
              className={`whitespace-pre-wrap text-sm leading-relaxed p-4 rounded-xl font-body ${
                darkMode
                  ? "bg-slate-800/80 text-slate-200 border border-slate-700"
                  : "bg-indigo-50/60 text-slate-700 border border-indigo-100"
              }`}
            >
              {result}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AIToolCard;
