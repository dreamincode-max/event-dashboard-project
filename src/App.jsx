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
import AIAssistant from "./Screens/AIAssistant";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div
              className={`flex min-h-screen transition-colors duration-300 ${
                darkMode ? "dark bg-slate-950" : "bg-slate-50"
              }`}
            >
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              <div className="flex-1 flex flex-col min-w-0">
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                  <Header
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    onMenuToggle={() => setSidebarOpen(true)}
                  />

                  <main id="main-content" className="page-container" tabIndex={-1}>
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
                        path="/ai"
                        element={<AIAssistant darkMode={darkMode} />}
                      />
                      <Route
                        path="/settings"
                        element={<Settings darkMode={darkMode} />}
                      />
                      <Route path="/profile" element={<Profile darkMode={darkMode} />} />
                      <Route path="/event/:shareId" element={<EventDetails darkMode={darkMode} />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
