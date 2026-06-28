import { motion } from "framer-motion";

function StatsCard({
  title,
  value,
  icon,
  darkMode,
  index = 0,
  accent = "indigo",
  subtitle,
  trend,
}) {
  const accents = {
    indigo: "from-indigo-500 to-violet-600 shadow-indigo-500/25",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/25",
    amber: "from-amber-500 to-orange-500 shadow-amber-500/25",
    rose: "from-rose-500 to-pink-600 shadow-rose-500/25",
    sky: "from-sky-500 to-blue-600 shadow-sky-500/25",
    violet: "from-violet-500 to-purple-600 shadow-violet-500/25",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`card card-hover p-5 sm:p-6 ${darkMode ? "card-dark" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>
          <h2
            className={`font-display text-2xl sm:text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {value}
          </h2>
          {subtitle && (
            <p className={`text-xs mt-1.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              {subtitle}
            </p>
          )}
          {trend && (
            <span
              className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend.positive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {trend.label}
            </span>
          )}
        </div>

        <div
          className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${accents[accent] || accents.indigo} text-white flex items-center justify-center text-xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default StatsCard;
