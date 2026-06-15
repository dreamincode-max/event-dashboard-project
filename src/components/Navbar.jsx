function Navbar() {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
      <h2 className="text-2xl font-bold">
        Event Planning Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">
          Welcome, Admin 👋
        </span>

        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </div>
  );
}

export default Navbar;