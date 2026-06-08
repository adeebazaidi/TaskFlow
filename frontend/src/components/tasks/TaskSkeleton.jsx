export default function TaskSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 animate-pulse">
      <div className="w-5 h-5 rounded-full bg-slate-200 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-5/6" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-slate-200 rounded w-16" />
          <div className="h-5 bg-slate-200 rounded w-16" />
          <div className="h-5 bg-slate-200 rounded w-24 ml-auto" />
        </div>
      </div>
    </div>
  );
}
