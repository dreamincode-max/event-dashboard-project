import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMagic, FaTimes, FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  generateEventDescription,
  generateBudgetSuggestion,
  extractSuggestedBudget,
} from "../../services/aiApi";

function AIQuickPanel({ darkMode, title, date, location, budget, onApplyBudget }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("description");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [source, setSource] = useState("");

  const eventData = {
    title,
    date,
    location,
    eventType: "celebration",
    guestCount: "100",
  };

  const runAI = async (type) => {
    if (!title.trim()) {
      toast.warning("Enter an event title first");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const fn =
        type === "description"
          ? generateEventDescription
          : generateBudgetSuggestion;
      const { result: text, source: src } = await fn(eventData);
      setResult(text);
      setSource(src);
      toast.success(`Generated via ${src}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "AI generation failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBudget = () => {
    const suggested = extractSuggestedBudget(result);
    if (suggested) {
      onApplyBudget(suggested);
      toast.success("Budget applied!");
      setOpen(false);
    } else {
      toast.warning("Could not extract budget amount");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-secondary btn-sm"
      >
        <FaMagic /> AI Assist
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-auto sm:w-full sm:max-w-lg rounded-2xl border shadow-2xl p-6 ${
                darkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-display font-bold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>
                  AI Quick Assist
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost btn-icon"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                {["description", "budget"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTab(t);
                      setResult("");
                    }}
                    className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-secondary"}`}
                  >
                    {t === "description" ? "Description" : "Budget"}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => runAI(tab)}
                disabled={loading}
                className="btn btn-primary w-full mb-4"
              >
                <FaMagic /> {loading ? "Generating…" : `Generate ${tab === "description" ? "Description" : "Budget"}`}
              </button>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-500 uppercase">
                      {source}
                    </span>
                    <div className="flex gap-2">
                      {tab === "budget" && (
                        <button type="button" onClick={handleApplyBudget} className="btn btn-success btn-sm">
                          Apply Budget
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(result);
                          toast.success("Copied!");
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <FaCopy /> Copy
                      </button>
                    </div>
                  </div>
                  <pre
                    className={`whitespace-pre-wrap text-sm p-4 rounded-xl max-h-60 overflow-y-auto ${
                      darkMode
                        ? "bg-slate-800 text-slate-200"
                        : "bg-indigo-50 text-slate-700"
                    }`}
                  >
                    {result}
                  </pre>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIQuickPanel;
