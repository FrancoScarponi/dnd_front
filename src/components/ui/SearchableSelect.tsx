import { useEffect, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export default function SearchableSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Buscar...",
  disabled,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm text-zinc-400 mb-1">{label}</label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
      >
        <span className={selected ? "" : "text-zinc-500"}>
          {selected?.label ?? "Seleccionar..."}
        </span>
        <span className="text-zinc-400">▾</span>
      </button>

      {open && !disabled && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 shadow-lg">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full border-b border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
          />

          <div className="max-h-60 overflow-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-zinc-500">
                Sin resultados
              </div>
            )}

            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setQuery("");
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
