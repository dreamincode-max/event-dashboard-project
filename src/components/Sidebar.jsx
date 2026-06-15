import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaWallet,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        Event Planner
      </h1>

      <ul className="space-y-5">
        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition">
          <FaTachometerAlt />
          Dashboard
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition">
          <FaCalendarAlt />
          Events
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition">
          <FaUsers />
          Guests
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition">
          <FaWallet />
          Budget
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition">
          <FaCog />
          Settings
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;