export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-end">
        <div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
          <div className="h-10 w-64 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-48 bg-slate-200 rounded-2xl"></div>
          <div className="h-10 w-24 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-200 border-3 border-black/5 rounded-3xl"
          />
        ))}
      </div>
      <div className="h-100 w-full bg-slate-200 border-3 border-black/5 rounded-4xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-75 bg-slate-200 border-3 border-black/5 rounded-4xl" />
        <div className="h-75 bg-slate-200 border-3 border-black/5 rounded-4xl" />
      </div>
    </div>
  );
}
