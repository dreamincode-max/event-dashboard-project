function Skeleton({ className = "", style }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ darkMode }) {
  return (
    <div className={`card p-6 ${darkMode ? "card-dark" : ""}`}>
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5, darkMode }) {
  return (
    <div className={`card p-6 ${darkMode ? "card-dark" : ""}`}>
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-10 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart({ darkMode }) {
  return (
    <div className={`card p-6 ${darkMode ? "card-dark" : ""}`}>
      <Skeleton className="h-6 w-56 mb-6" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export function SkeletonDashboard({ darkMode }) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} darkMode={darkMode} />
        ))}
      </div>
      <SkeletonChart darkMode={darkMode} />
      <SkeletonChart darkMode={darkMode} />
    </div>
  );
}

export default Skeleton;
