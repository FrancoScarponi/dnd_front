import { FormEvent, useEffect, useMemo, useState } from "react";
import Input from "../ui/Input";
import SearchableSelect, { type SelectOption } from "../ui/SearchableSelect";
import type { CharacterDTO, CharacterUpsertInput } from "../../types/characterTypes";
import { dndList, type DndListItem, dndGet } from "../../api/dnd5e.client";

const DEFAULT_FORM: CharacterUpsertInput = {
  campaign: null,
  name: "",
  class: "",
  race: "",
  level: 1,
  xp: 0,
  stats: {
    hp: 10,
    maxHp: 10,
    ac: 10,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  armorClass: 10,
  skills: {},     //skillIndex -> number
  equipment: [],  //equipmentIndex[]
  background: "",
  notes: "",
};

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
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

function toOptions(items: DndListItem[]): SelectOption[] {
  return items.map((i) => ({ value: i.index, label: i.name }));
}

function labelFrom(options: SelectOption[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

// Equipment: SearchableSelect + "Agregar" + listado */
function EquipmentPicker({
  options,
  selected,
  onAdd,
  onRemove,
  disabled,
}: {
  options: SelectOption[];
  selected: string[];
  onAdd: (equipmentIndex: string) => void;
  onRemove: (equipmentIndex: string) => void;
  disabled?: boolean;
}) {
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
              <span className="truncate max-w-[220px]">{labelFrom(options, idx)}</span>
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

// Skills: SearchableSelect , Agregar y listado con número
function SkillsPicker({
  options,
  skillsMap,
  onAdd,
  onRemove,
  onChangeValue,
  disabled,
}: {
  options: SelectOption[];
  skillsMap: Record<string, number>;
  onAdd: (skillIndex: string) => void;
  onRemove: (skillIndex: string) => void;
  onChangeValue: (skillIndex: string, value: number) => void;
  disabled?: boolean;
}) {
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

type ClassDetail = { hit_die: number };

export default function CharacterForm({
  initial,
  onSubmit,
  loading,
  error,
  submitLabel,
}: {
  initial?: CharacterDTO | null;
  onSubmit: (body: CharacterUpsertInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  submitLabel: string;
}) {
  const init = useMemo<CharacterUpsertInput>(() => {
    if (!initial) return DEFAULT_FORM;

    return {
      campaign: initial.campaign ?? null,
      name: initial.name ?? "",
      class: initial.class ?? "",
      race: initial.race ?? "",
      level: initial.level ?? 1,
      xp: initial.xp ?? 0,
      stats: {
        hp: initial.stats?.hp ?? 10,
        maxHp: initial.stats?.maxHp ?? 10,
        ac: initial.stats?.ac ?? 10,
        strength: initial.stats?.strength ?? 10,
        dexterity: initial.stats?.dexterity ?? 10,
        constitution: initial.stats?.constitution ?? 10,
        intelligence: initial.stats?.intelligence ?? 10,
        wisdom: initial.stats?.wisdom ?? 10,
        charisma: initial.stats?.charisma ?? 10,
      },
      armorClass: initial.armorClass ?? (initial.stats?.ac ?? 10),
      skills: (initial.skills ?? {}) as Record<string, number>,
      equipment: initial.equipment ?? [],
      background: initial.background ?? "",
      notes: initial.notes ?? "",
    };
  }, [initial]);

  const [form, setForm] = useState<CharacterUpsertInput>(init);

  // catálogos
  const [classes, setClasses] = useState<DndListItem[]>([]);
  const [races, setRaces] = useState<DndListItem[]>([]);
  const [skills, setSkills] = useState<DndListItem[]>([]);
  const [equipment, setEquipment] = useState<DndListItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const classOptions = useMemo(() => toOptions(classes), [classes]);
  const raceOptions = useMemo(() => toOptions(races), [races]);
  const skillOptions = useMemo(() => toOptions(skills), [skills]);
  const equipmentOptions = useMemo(() => toOptions(equipment), [equipment]);

  useEffect(() => {
    let active = true;
    (async () => {
      setCatalogError(null);
      setCatalogLoading(true);
      try {
        const [cls, rc, sk, eq] = await Promise.all([
          dndList("/classes"),
          dndList("/races"),
          dndList("/skills"),
          dndList("/equipment"),
        ]);
        if (!active) return;
        setClasses(cls);
        setRaces(rc);
        setSkills(sk);
        setEquipment(eq);
      } catch (e) {
        if (!active) return;
        setCatalogError(e instanceof Error ? e.message : "Error cargando DnD5e API");
      } finally {
        if (!active) return;
        setCatalogLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // skills handlers
  const addSkill = (skillIndex: string) => {
    const cur = { ...(form.skills ?? {}) } as Record<string, number>;
    if (cur[skillIndex] !== undefined) return; // no duplicar
    cur[skillIndex] = 0;
    setForm({ ...form, skills: cur });
  };

  const removeSkill = (skillIndex: string) => {
    const cur = { ...(form.skills ?? {}) } as Record<string, number>;
    delete cur[skillIndex];
    setForm({ ...form, skills: cur });
  };

  const setSkillValue = (skillIndex: string, value: number) => {
    const cur = { ...(form.skills ?? {}) } as Record<string, number>;
    cur[skillIndex] = Number.isFinite(value) ? value : 0;
    setForm({ ...form, skills: cur });
  };

  // equipment handlers
  const addEquipment = (equipmentIndex: string) => {
    const cur = new Set(form.equipment ?? []);
    cur.add(equipmentIndex);
    setForm({ ...form, equipment: Array.from(cur) });
  };

  const removeEquipment = (equipmentIndex: string) => {
    const cur = new Set(form.equipment ?? []);
    cur.delete(equipmentIndex);
    setForm({ ...form, equipment: Array.from(cur) });
  };

  // autocompletar HP sugerido según clase
  useEffect(() => {
    let active = true;
    (async () => {
      if (!form.class) return;
      try {
        const detail = await dndGet<ClassDetail>(`/classes/${form.class}`);
        if (!active) return;
        const base = detail.hit_die ?? 10;
        setForm((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            maxHp: prev.stats.maxHp || base,
            hp: prev.stats.hp || base,
          },
        }));
      } catch {
        // no crítico
      }
    })();
    return () => {
      active = false;
    };
  }, [form.class]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanName = form.name.trim();
    if (!cleanName) return;
    if (!form.class || !form.race) return;

    const body: CharacterUpsertInput = {
      ...form,
      name: cleanName,
      background: form.background.trim(),
      notes: form.notes.trim(),
      armorClass: form.armorClass || form.stats.ac,
      stats: {
        ...form.stats,
        ac: form.stats.ac || form.armorClass,
      },
      skills: (form.skills ?? {}) as Record<string, number>,
      equipment: form.equipment ?? [],
    };

    await onSubmit(body);
  };

  const submitDisabled = loading || catalogLoading;

  return (
    <form onSubmit={submit} className="space-y-6">
      {catalogLoading && (
        <p className="text-sm text-zinc-400">Cargando catálogos de DnD5e API...</p>
      )}
      {catalogError && <p className="text-sm text-red-400">{catalogError}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Eldrin"
          required
        />

        <SearchableSelect
          label="Clase"
          value={form.class}
          options={classOptions}
          onChange={(v) => setForm({ ...form, class: v })}
          placeholder="Buscar clase..."
          disabled={catalogLoading}
        />

        <SearchableSelect
          label="Raza"
          value={form.race}
          options={raceOptions}
          onChange={(v) => setForm({ ...form, race: v })}
          placeholder="Buscar raza..."
          disabled={catalogLoading}
        />

        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Level"
            value={form.level}
            min={1}
            max={20}
            onChange={(n) => setForm({ ...form, level: n })}
          />
          <NumberInput
            label="XP"
            value={form.xp}
            min={0}
            onChange={(n) => setForm({ ...form, xp: n })}
          />
        </div>
      </div>

      {/* Skills selector + listado con número */}
      <SkillsPicker
        options={skillOptions}
        skillsMap={(form.skills ?? {}) as Record<string, number>}
        onAdd={addSkill}
        onRemove={removeSkill}
        onChangeValue={setSkillValue}
        disabled={catalogLoading}
      />

      {/* Equipment selector + listado */}
      <EquipmentPicker
        options={equipmentOptions}
        selected={form.equipment ?? []}
        onAdd={addEquipment}
        onRemove={removeEquipment}
        disabled={catalogLoading}
      />

      {/* Stats */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="font-semibold mb-3">Stats</div>

        <div className="grid gap-3 sm:grid-cols-3">
          <NumberInput
            label="HP"
            value={form.stats.hp}
            min={0}
            onChange={(n) => setForm({ ...form, stats: { ...form.stats, hp: n } })}
          />
          <NumberInput
            label="Max HP"
            value={form.stats.maxHp}
            min={0}
            onChange={(n) => setForm({ ...form, stats: { ...form.stats, maxHp: n } })}
          />
          <NumberInput
            label="AC"
            value={form.stats.ac}
            min={0}
            onChange={(n) =>
              setForm({ ...form, stats: { ...form.stats, ac: n }, armorClass: n })
            }
          />

          <NumberInput label="Strength" value={form.stats.strength} min={1}
            onChange={(n) => setForm({ ...form, stats: { ...form.stats, strength: n } })}
          />
          <NumberInput label="Dexterity" value={form.stats.dexterity} min={1}
            onChange={(n) => setForm({ ...form, stats: { ...form.stats, dexterity: n } })}
          />
          <NumberInput label="Constitution" value={form.stats.constitution} min={1}
            onChange={(n) => setForm({ ...form, stats: { ...form.stats, constitution: n } })}
          />
          <NumberInput label="Intelligence" value={form.stats.intelligence} min={1}
            onChange={(n) => setForm({ ...form, stats: { ...form.stats, intelligence: n } })}
          />
          <NumberInput label="Wisdom" value={form.stats.wisdom} min={1}
            onChange={(n) => setForm({ ...form, stats: { ...form.stats, wisdom: n } })}
          />
          <NumberInput label="Charisma" value={form.stats.charisma} min={1}
            onChange={(n) => setForm({ ...form, stats: { ...form.stats, charisma: n } })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-zinc-400">Background</label>
        <textarea
          value={form.background}
          onChange={(e) => setForm({ ...form, background: e.target.value })}
          className="w-full min-h-[90px] rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Historia corta del personaje..."
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-zinc-400">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full min-h-[120px] rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Notas del DM..."
        />
      </div>

      <button
        disabled={submitDisabled}
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition-colors"
      >
        {loading ? "Guardando..." : submitLabel}
      </button>

      {error && <p className="text-sm text-red-400 text-center">{error}</p>}
    </form>
  );
}
