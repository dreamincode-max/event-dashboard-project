import React from "react";

function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-300 text-sm">
          {title}
        </p>

        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
          {value}
        </h2>
      </div>

      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-3xl shadow-lg">
        {icon}
      </div>
    </div>
  );
}

export default StatsCard;