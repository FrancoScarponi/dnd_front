import { useState } from "react";
import SearchableSelect, { type SelectOption } from "../ui/SearchableSelect";

function labelFrom(options: SelectOption[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

type SkillsPickerProps = {
  options: SelectOption[];
  skillsMap: Record<string, number>;
  onAdd: (skillIndex: string) => void;
  onRemove: (skillIndex: string) => void;
  onChangeValue: (skillIndex: string, value: number) => void;
  disabled?: boolean;
};

export function SkillsPicker({
  options,
  skillsMap,
  onAdd,
  onRemove,
  onChangeValue,
  disabled,
}: SkillsPickerProps) {
  const [pick, setPick] = useState("");
  const selectedIndexes = Object.keys(skillsMap);

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
          <div className="font-semibold">Skills</div>
          <div className="text-xs text-zinc-500 mt-1">
            Agregás skills del catálogo y les asignás el bonus (número).
          </div>
        </div>
        <div className="text-xs text-zinc-500">{selectedIndexes.length} skills</div>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-end">
        <SearchableSelect
          label="Buscar skill"
          value={pick}
          options={options}
          onChange={setPick}
          placeholder="Buscar skill..."
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

      {selectedIndexes.length === 0 ? (
        <div className="text-sm text-zinc-500">No agregaste skills todavía.</div>
      ) : (
        <div className="grid gap-2">
          {selectedIndexes.map((idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-sm text-zinc-200 truncate">
                  {labelFrom(options, idx)}
                </div>
                <div className="text-xs text-zinc-500 font-mono">{idx}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  value={Number.isFinite(skillsMap[idx]) ? skillsMap[idx] : 0}
                  disabled={disabled}
                  onChange={(e) => onChangeValue(idx, Number(e.target.value))}
                  className="w-24 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
