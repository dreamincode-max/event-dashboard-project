import { motion } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaBriefcase } from "react-icons/fa";
import PageHeader from "../components/ui/PageHeader";

function Profile({ darkMode }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your account information."
        darkMode={darkMode}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card p-8 sm:p-10 max-w-lg mx-auto ${darkMode ? "card-dark" : ""}`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-5">
            <FaUserCircle className="text-white text-6xl" />
          </div>

          <h1 className={`font-display text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Jahnavi
          </h1>
          <p className={`mt-1 flex items-center gap-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <FaBriefcase className="text-indigo-500" />
            Event Manager
          </p>
          <p className={`mt-2 flex items-center gap-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <FaEnvelope className="text-indigo-500" />
            jahnavi@example.com
          </p>

          <div className={`w-full mt-8 pt-6 border-t ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className={`p-4 rounded-xl ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</p>
                <p className={`font-semibold mt-1 ${darkMode ? "text-white" : "text-slate-900"}`}>Event Manager</p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
                <p className="font-semibold mt-1 text-emerald-500">Active</p>
              </div>
            </div>
          </div>

          <button className="btn btn-primary mt-6 w-full sm:w-auto">
            Edit Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
