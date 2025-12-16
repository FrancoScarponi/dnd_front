export function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  const map: Record<string, string> = {
    CREATED: "bg-zinc-700 text-zinc-200",
    STARTED: "bg-emerald-600 text-white",
    PAUSED: "bg-yellow-500 text-black",
    ENDED: "bg-red-600 text-white",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        map[status] ?? "bg-zinc-700 text-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}
