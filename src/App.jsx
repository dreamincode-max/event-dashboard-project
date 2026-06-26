import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Screens/Profile";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import EventDetails from "./Screens/EventDetails";
import Dashboard from "./Screens/Dashboard";
import Events from "./Screens/Events";
import Guests from "./Screens/Guests";
import Budget from "./Screens/Budget";
import Settings from "./Screens/Settings";
import Login from "./Screens/Login";
import Register from "./Screens/Register";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen">
              <Sidebar />

              <div
                className={`flex-1 p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-black"
                }`}
              >
                <Header
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />

                <Routes>
                  <Route
                    path="/"
                    element={<Dashboard darkMode={darkMode} />}
                  />

                  <Route
                    path="/events"
                    element={<Events darkMode={darkMode} />}
                  />

                  <Route
                    path="/guests"
                    element={<Guests darkMode={darkMode} />}
                  />

                  <Route
                    path="/budget"
                    element={<Budget darkMode={darkMode} />}
                  />

                  <Route
                    path="/settings"
                    element={<Settings darkMode={darkMode} />}
                  />
                  <Route
                     path="/profile"
                    element={<Profile />}
                  />
                  <Route
  path="/event/:shareId"
  element={<EventDetails />}
/>
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;