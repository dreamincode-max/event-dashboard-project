import { motion } from "framer-motion";
import { FaUserCircle, FaShieldAlt, FaThLarge } from "react-icons/fa";
import PageHeader from "../components/ui/PageHeader";

function Settings({ darkMode }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and application settings."
        darkMode={darkMode}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card p-6 sm:p-8 max-w-3xl ${darkMode ? "card-dark" : ""}`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <FaUserCircle className="text-white text-4xl" />
          </div>

          <div className="text-center sm:text-left">
            <h2 className={`font-display text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              Jahnavi
            </h2>
            <p className={`mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Event Manager</p>
            <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              jahnaviummadi007@gmail.com
            </p>
          </div>
        </div>

        <div className={`border-t pt-6 space-y-4 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
          <div className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? "bg-slate-800/60" : "bg-slate-50"}`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
              <FaShieldAlt className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Account Type</h3>
              <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Administrator</p>
            </div>
          </div>

          <div className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? "bg-slate-800/60" : "bg-slate-50"}`}>
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
              <FaThLarge className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Application</h3>
              <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Wedding Event Planner Dashboard
              </p>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="btn btn-danger mt-8">
          Logout
        </button>
      </motion.div>
    </div>
  );
}

export default Settings;
