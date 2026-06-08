export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-10 h-10' };

  const spinner = (
    <div className={`${sizes[size]} border-2 border-border border-t-indigo-600 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-border border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-text-secondary text-sm font-medium">Loading TaskFlow…</p>
      </div>
    );
  }

  return spinner;
}
