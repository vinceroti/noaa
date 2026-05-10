export default function Loading() {
  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-8 relative z-10">
      {/* Selector skeletons */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-14 shrink-0 rounded-full bg-slate-200/60 dark:bg-white/8 animate-pulse" />
          ))}
        </div>
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-28 shrink-0 rounded-full bg-slate-200/60 dark:bg-white/8 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Card skeletons */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 animate-pulse">
            {/* Name row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="h-5 w-40 rounded bg-slate-200/70 dark:bg-white/10 mb-2" />
                <div className="h-3 w-16 rounded bg-slate-100/80 dark:bg-white/6" />
              </div>
              <div className="h-7 w-28 rounded-full bg-slate-100/80 dark:bg-white/6" />
            </div>
            {/* Hero */}
            <div className="h-8 w-36 rounded bg-slate-200/70 dark:bg-white/10 mb-4" />
            {/* Stats */}
            <div className="flex gap-5">
              <div className="h-4 w-12 rounded bg-slate-100/80 dark:bg-white/6" />
              <div className="h-4 w-20 rounded bg-slate-100/80 dark:bg-white/6" />
              <div className="h-4 w-24 rounded bg-slate-100/80 dark:bg-white/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
