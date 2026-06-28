import { motion } from "framer-motion";

function PageHeader({ title, subtitle, actions, darkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-6 ${
        darkMode
          ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 border border-slate-700/50"
          : "bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600"
      }`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-violet-300 blur-3xl" />
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm sm:text-base text-indigo-100/90 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default PageHeader;
