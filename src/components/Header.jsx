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
    <div className="bg-white rounded-3xl shadow-lg px-8 py-5 mb-8 flex justify-between items-center border border-pink-100">
      <div>
  <h1 className="text-3xl font-bold text-gray-800">
    Event Planner Dashboard
  </h1>

  <p className="text-gray-500 mt-1">
    Welcome back! Manage all your events in one place.
  </p>
</div>

      <div className="flex items-center gap-6">
        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="px-5 py-3 rounded-2xl bg-pink-50 border border-pink-200 hover:bg-pink-100 transition-all duration-300 flex items-center gap-2 shadow-sm"
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
    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
  <FaUserCircle
    size={30}
    className="text-pink-600"
  />
</div>

    <div>
     <p className="font-bold text-gray-800 text-lg"> 
        Jahnavi
      </p>

      <p className="text-sm text-pink-500 font-medium">
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