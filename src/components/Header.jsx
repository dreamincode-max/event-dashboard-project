import {
  FaUserCircle,
  FaMoon,
  FaSun,
  FaBars,
  FaBell,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Header({ darkMode, setDarkMode, onMenuToggle }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 mb-6 rounded-2xl border backdrop-blur-xl transition-colors duration-300 ${
        darkMode
          ? "bg-slate-900/80 border-slate-700/60 shadow-lg shadow-black/20"
          : "bg-white/80 border-slate-200/80 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className={`lg:hidden btn btn-icon shrink-0 ${
              darkMode
                ? "text-slate-300 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            aria-label="Open menu"
          >
            <FaBars />
          </button>

          <div className="min-w-0">
            <h2
              className={`font-display text-base sm:text-lg font-bold truncate ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Event Planner Dashboard
            </h2>
            <p
              className={`text-xs sm:text-sm truncate ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Welcome back! Manage all your events in one place.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            className={`hidden sm:flex btn btn-icon relative ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label="Notifications"
          >
            <FaBell className="text-sm" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`btn btn-icon ${
              darkMode
                ? "text-amber-400 hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            aria-expanded={showMenu}
            aria-haspopup="menu"
            aria-label="Account menu"
            className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-colors ${
                darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <div className="hidden md:block text-left">
                <p
                  className={`text-sm font-semibold leading-none ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Jahnavi
                </p>
                <p className="text-xs text-indigo-500 font-medium mt-0.5">
                  Event Manager
                </p>
              </div>
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-52 rounded-xl border shadow-xl overflow-hidden z-50 ${
                    darkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  }`}
                  role="menu"
                >
                  <div
                    className={`px-4 py-3 border-b ${
                      darkMode ? "border-slate-700" : "border-slate-100"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Jahnavi
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      jahnaviummadi007@gmail.com
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/profile");
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                      darkMode
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-slate-700 hover:bg-indigo-50"
                    }`}
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/settings");
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                      darkMode
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-slate-700 hover:bg-indigo-50"
                    }`}
                  >
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      const confirmLogout = window.confirm(
                        "Are you sure you want to logout?"
                      );
                      if (confirmLogout) {
                        setShowMenu(false);
                        localStorage.removeItem("token");
                        navigate("/login");
                      }
                    }}
                    className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
