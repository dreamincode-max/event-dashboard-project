function StatsCard({
  title,
  value,
  icon,
  darkMode,
}) {
  return (
    <div
      className={`p-6 rounded-3xl shadow-lg hover:scale-105 transition ${
        darkMode
          ? "bg-slate-800 text-white"
          : "bg-white text-black"
      }`}
    >
      <div className="text-3xl mb-3">
        {icon}
      </div>

      <h3
        className={
          darkMode
            ? "text-gray-300"
            : "text-gray-500"
        }
      >
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2 text-[#B76E79]">
        {value}
      </p>
    </div>
  );
}

export default StatsCard;