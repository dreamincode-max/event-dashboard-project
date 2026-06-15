function App() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Event Planner</h1>

        <ul className="space-y-4">
          <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
          <li className="hover:text-blue-400 cursor-pointer">Events</li>
          <li className="hover:text-blue-400 cursor-pointer">Guests</li>
          <li className="hover:text-blue-400 cursor-pointer">Budget</li>
          <li className="hover:text-blue-400 cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Navbar */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Event Planning Dashboard
          </h2>

          <div className="font-medium">
            Welcome, Admin 👋
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Total Events</h3>
            <p className="text-3xl font-bold mt-2">24</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Upcoming</h3>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Guests</h3>
            <p className="text-3xl font-bold mt-2">520</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Budget</h3>
            <p className="text-3xl font-bold mt-2">₹1.2L</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;