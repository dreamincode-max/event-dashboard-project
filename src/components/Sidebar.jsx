import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaWallet,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaStar,
  FaRobot,
} from "react-icons/fa";

const navItems = [
  { to: "/", icon: FaTachometerAlt, label: "Dashboard" },
  { to: "/events", icon: FaCalendarAlt, label: "Events" },
  { to: "/guests", icon: FaUsers, label: "Guests" },
  { to: "/budget", icon: FaWallet, label: "Budget" },
  { to: "/ai", icon: FaRobot, label: "AI Assistant" },
  { to: "/settings", icon: FaCog, label: "Settings" },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <FaStar className="text-white text-sm" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white tracking-tight leading-none">
              SLV Events
            </h1>
            <p className="text-[10px] text-indigo-300/70 font-medium tracking-widest uppercase mt-0.5">
              Planner Pro
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden btn btn-ghost text-slate-400 hover:text-white hover:bg-white/10 btn-icon"
          aria-label="Close menu"
        >
          <FaTimes />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Main navigation">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Main Menu
        </p>
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white shadow-lg shadow-indigo-900/40"
                  : "text-slate-400 hover:text-white hover:bg-white/8"
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  active
                    ? "bg-white/20"
                    : "bg-white/5 group-hover:bg-white/10"
                }`}
              >
                <Icon className="text-sm" />
              </span>
              {label}
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          type="button"
          aria-label="Logout"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">
            <FaSignOutAlt className="text-sm" />
          </span>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 shrink-0 bg-slate-950 border-r border-slate-800/80 min-h-screen sticky top-0">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 left-0 w-72 z-50 bg-slate-950 border-r border-slate-800/80 lg:hidden shadow-2xl"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
