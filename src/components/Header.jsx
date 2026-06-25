import {
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

;
function Header({
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 mb-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-black">
        Event Planner Dashboard
      </h1>

      <div className="flex items-center gap-6">
        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="px-4 py-2 rounded-xl bg-gray-200 flex items-center gap-2 hover:bg-gray-300 transition"
        >
          {darkMode ? (
            <>
              <FaSun className="text-yellow-500" />
              <span className="text-black">
                Light Mode
              </span>
            </>
          ) : (
            <>
              <FaMoon className="text-black" />
              <span className="text-black">
                Dark Mode
              </span>
            </>
          )}
        </button>

        <div className="relative">
  <button
    onClick={() => setShowMenu(!showMenu)}
    className="flex items-center gap-3"
  >
    <FaUserCircle
      size={40}
      className="text-gray-600"
    />

    <div>
      <p className="font-semibold text-black">
        Jahnavi
      </p>

      <p className="text-sm text-gray-500">
        Event Manager
      </p>
    </div>
  </button>

  {showMenu && (
    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border z-50">
      <button
  onClick={() => navigate("/profile")}
  className="block w-full text-left px-4 py-3 hover:bg-gray-100"
>
  My Profile
</button>

      <button
        className="block w-full text-left px-4 py-3 hover:bg-gray-100"
      >
        Settings
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  )}
</div>
      </div>
    </div>
  );
}

export default Header;