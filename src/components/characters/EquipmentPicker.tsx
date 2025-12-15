import { useState } from "react";
import SearchableSelect, { type SelectOption } from "../ui/SearchableSelect";

function labelFrom(options: SelectOption[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

type EquipmentPickerProps = {
  options: SelectOption[];
  selected: string[];
  onAdd: (equipmentIndex: string) => void;
  onRemove: (equipmentIndex: string) => void;
  disabled?: boolean;
};

export function EquipmentPicker({
  options,
  selected,
  onAdd,
  onRemove,
  disabled,
}: EquipmentPickerProps) {
  const [pick, setPick] = useState("");

  const add = () => {
    const v = pick.trim();
    if (!v) return;
    onAdd(v);
    setPick("");
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">Equipment</div>
          <div className="text-xs text-zinc-500 mt-1">
            Elegí del catálogo y agregalo a la lista.
          </div>
        </div>
        <div className="text-xs text-zinc-500">{selected.length} items</div>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-end">
        <SearchableSelect
          label="Buscar equipo"
          value={pick}
          options={options}
          onChange={setPick}
          placeholder="Buscar equipment..."
          disabled={disabled}
        />
        <button
          type="button"
          onClick={add}
          disabled={disabled || !pick}
          className="h-[42px] rounded-md bg-zinc-900 border border-zinc-800 px-4 text-sm text-zinc-200 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>

      {selected.length === 0 ? (
        <div className="text-sm text-zinc-500">No agregaste equipment todavía.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selected.map((idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-200"
            >
              <span className="truncate max-w-[220px]">
                {labelFrom(options, idx)}
              </span>
              <span className="text-xs text-zinc-500 font-mono">{idx}</span>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-zinc-400 hover:text-white"
                aria-label={`Quitar ${idx}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
