import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaWallet,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
   const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
  return (
   <div className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        SLV EVENTS
      </h1>

      <ul className="space-y-5">
        <li>
          <Link
            to="/"
            className="flex items-center gap-3 hover:text-blue-400"
          >
            <FaTachometerAlt />
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/events"
            className="flex items-center gap-3 hover:text-blue-400"
          >
            <FaCalendarAlt />
            Events
          </Link>
        </li>

        <li>
          <Link
            to="/guests"
            className="flex items-center gap-3 hover:text-blue-400"
          >
            <FaUsers />
            Guests
          </Link>
        </li>

        <li>
          <Link
            to="/budget"
            className="flex items-center gap-3 hover:text-blue-400"
          >
            <FaWallet />
            Budget
          </Link>
        </li>

        <li>
          <Link
            to="/settings"
            className="flex items-center gap-3 hover:text-blue-400"
          >
            <FaCog />
            Settings
          </Link>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 hover:text-red-400"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;