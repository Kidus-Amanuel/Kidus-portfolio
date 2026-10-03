export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-sm tracking-widest uppercase font-medium text-white/70 animate-pulse">
          Loading Environment
        </span>
      </div>
    </div>
  );
}
