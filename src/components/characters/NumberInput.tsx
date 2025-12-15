type NumberInputProps = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
};

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
}: NumberInputProps) {
  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-1">{label}</label>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
