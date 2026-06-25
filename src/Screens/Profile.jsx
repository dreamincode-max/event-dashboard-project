import { FaUserCircle } from "react-icons/fa";

function Profile() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex flex-col items-center">

        <FaUserCircle
          size={120}
          className="text-gray-500"
        />

        <h1 className="text-3xl font-bold mt-4">
          Jahnavi
        </h1>

        <p className="text-gray-600">
          Event Manager
        </p>

        <p className="text-gray-500">
          jahnavi@example.com
        </p>

        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg">
          Edit Profile
        </button>

      </div>
    </div>
  );
}

export default Profile;