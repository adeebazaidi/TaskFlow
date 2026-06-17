export default function TaskSkeleton() {
  return (
    <div className="bg-card border border-border/60 rounded-[18px] p-4.5 flex gap-3.5 animate-pulse">
      <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-5/6" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-16" />
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-16" />
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-24 ml-auto" />
        </div>
      </div>
    </div>
  );
}
