import { FaUserCircle } from "react-icons/fa";

function Settings() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Settings
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 max-w-4xl">
        <div className="flex items-center gap-6 mb-8">
          <FaUserCircle
            size={80}
            className="text-gray-500"
          />

          <div>
            <h2 className="text-2xl font-bold text-black">
              Jahnavi
            </h2>

            <p className="text-gray-500">
              Event Manager
            </p>

            <p className="text-gray-500">
              jahnaviummadi007@gmail.com
            </p>
          </div>
        </div>

        <hr className="mb-8" />

        <div className="space-y-4">
          <div className="bg-slate-100 p-4 rounded-xl">
            <h3 className="font-semibold text-black dark:text-white">
              Account Type
            </h3>

            <p className="text-gray-600">
              Administrator
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl">
            <h3 className="font-semibold text-black">
              Application
            </h3>

            <p className="text-gray-600">
              Wedding Event Planner Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;