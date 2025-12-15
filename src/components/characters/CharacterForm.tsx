import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../ui/Input";
import SearchableSelect, { type SelectOption } from "../ui/SearchableSelect";
import NumberInput from "../ui/NumberInput";
import { EquipmentPicker } from "./EquipmentPicker";
import { SkillsPicker } from "./SkillsPicker";
import { TextAreaField } from "../ui/TextAreaField";

import type {
  CharacterDTO,
  CharacterUpsertInput,
} from "../../types/characterTypes";
import { dndList, type DndListItem } from "../../api/dnd5e.client";

import {
  characterFormSchema,
  type CharacterFormValues,
} from "../../validation/characterSchemas";

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
  skills: {},
  equipment: [],
  background: "",
  notes: "",
};

function toOptions(items: DndListItem[]): SelectOption[] {
  return items.map((i) => ({ value: i.index, label: i.name }));
}


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
  // inicialización del form para new o edit
  const init = useMemo<CharacterFormValues>(() => {
    if (!initial) {
      return {
        ...(DEFAULT_FORM as CharacterFormValues),
      };
    }

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
      armorClass: initial.armorClass ?? initial.stats?.ac ?? 10,
      skills: (initial.skills ?? {}) as Record<string, number>,
      equipment: initial.equipment ?? [],
      background: initial.background ?? "",
      notes: initial.notes ?? "",
    };
  }, [initial]);

    const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(characterFormSchema),
    defaultValues: init,
  });

  // valores del form
  const stats = watch("stats");
  const skillsMap = (watch("skills") ?? {}) as Record<string, number>;
  const equipmentSelected = (watch("equipment") ?? []) as string[];
  const classValue = watch("class") || "";
  const raceValue = watch("race") || "";
  const levelValue = watch("level");
  const xpValue = watch("xp");

  // catalogos de slect etc etc
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
        setCatalogError(
          e instanceof Error ? e.message : "Error cargando DnD5e API"
        );
      } finally {
        if (active) {
          setCatalogLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // skills handlers usando setValue
  const addSkill = (skillIndex: string) => {
    const cur = { ...(skillsMap ?? {}) } as Record<string, number>;
    if (cur[skillIndex] !== undefined) return;
    cur[skillIndex] = 0;
    setValue("skills", cur, { shouldValidate: true });
  };

  const removeSkill = (skillIndex: string) => {
    const cur = { ...(skillsMap ?? {}) } as Record<string, number>;
    delete cur[skillIndex];
    setValue("skills", cur, { shouldValidate: true });
  };

  const setSkillValue = (skillIndex: string, value: number) => {
    const cur = { ...(skillsMap ?? {}) } as Record<string, number>;
    cur[skillIndex] = Number.isFinite(value) ? value : 0;
    setValue("skills", cur, { shouldValidate: true });
  };

  // equipment handlers usando setValue
  const addEquipment = (equipmentIndex: string) => {
    const cur = new Set(equipmentSelected ?? []);
    cur.add(equipmentIndex);
    setValue("equipment", Array.from(cur), { shouldValidate: true });
  };

  const removeEquipment = (equipmentIndex: string) => {
    const cur = new Set(equipmentSelected ?? []);
    cur.delete(equipmentIndex);
    setValue("equipment", Array.from(cur), { shouldValidate: true });
  };

  const submit = async (values: CharacterFormValues) => {
    const body: CharacterUpsertInput = {
      ...(values as CharacterUpsertInput),
      name: values.name.trim(),
      background: values.background?.trim() ?? "",
      notes: values.notes?.trim() ?? "",
      armorClass: values.armorClass ?? values.stats.ac,
      stats: {
        ...values.stats,
        ac: values.stats.ac ?? values.armorClass ?? values.stats.ac,
      },
      skills: (values.skills ?? {}) as Record<string, number>,
      equipment: (values.equipment ?? []) as string[],
    };

    await onSubmit(body);
  };

  const submitDisabled = loading || catalogLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {catalogLoading && (
        <p className="text-sm text-zinc-400">
          Cargando catálogos de DnD5e API...
        </p>
      )}
      {catalogError && <p className="text-sm text-red-400">{catalogError}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* nombre */}
        <div>
          <Input label="Nombre" placeholder="Eldrin" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* clase */}
        <div>
          <SearchableSelect
            label="Clase"
            value={classValue}
            options={classOptions}
            onChange={(v) => setValue("class", v, { shouldValidate: true })}
            placeholder="Buscar clase..."
            disabled={catalogLoading}
          />
          {errors.class && (
            <p className="text-xs text-red-400 mt-1">{errors.class.message}</p>
          )}
        </div>

        {/* raza */}
        <div>
          <SearchableSelect
            label="Raza"
            value={raceValue}
            options={raceOptions}
            onChange={(v) => setValue("race", v, { shouldValidate: true })}
            placeholder="Buscar raza..."
            disabled={catalogLoading}
          />
          {errors.race && (
            <p className="text-xs text-red-400 mt-1">{errors.race.message}</p>
          )}
        </div>

        {/* level y xp*/}
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Level"
            value={Number(levelValue ?? 1)}
            min={1}
            max={20}
            onChange={(n) => setValue("level", n, { shouldValidate: true })}
          />
          {errors.level && (
            <p className="text-xs text-red-400 mt-1 col-span-2">
              {errors.level.message}
            </p>
          )}

          <NumberInput
            label="XP"
            value={Number(xpValue ?? 0)}
            min={0}
            onChange={(n) => setValue("xp", n, { shouldValidate: true })}
          />
          {errors.xp && (
            <p className="text-xs text-red-400 mt-1 col-span-2">
              {errors.xp.message}
            </p>
          )}
        </div>
      </div>

      {/* skills selector y listado */}
      <SkillsPicker
        options={skillOptions}
        skillsMap={skillsMap}
        onAdd={addSkill}
        onRemove={removeSkill}
        onChangeValue={setSkillValue}
        disabled={catalogLoading}
      />

      {/* equipment selector y listado */}
      <EquipmentPicker
        options={equipmentOptions}
        selected={equipmentSelected}
        onAdd={addEquipment}
        onRemove={removeEquipment}
        disabled={catalogLoading}
      />

      {/* stats */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="font-semibold mb-3">Stats</div>

        <div className="grid gap-3 sm:grid-cols-3">
          <NumberInput
            label="HP"
            value={Number(stats?.hp ?? 0)}
            min={0}
            onChange={(n) => setValue("stats.hp", n, { shouldValidate: true })}
          />
          <NumberInput
            label="Max HP"
            value={Number(stats?.maxHp ?? 0)}
            min={0}
            onChange={(n) =>
              setValue("stats.maxHp", n, { shouldValidate: true })
            }
          />
          <NumberInput
            label="AC"
            value={Number(stats?.ac ?? 0)}
            min={0}
            onChange={(n) => {
              setValue("stats.ac", n, { shouldValidate: true });
              setValue("armorClass", n);
            }}
          />

          <NumberInput
            label="Strength"
            value={Number(stats?.strength ?? 10)}
            min={1}
            onChange={(n) =>
              setValue("stats.strength", n, { shouldValidate: true })
            }
          />
          <NumberInput
            label="Dexterity"
            value={Number(stats?.dexterity ?? 10)}
            min={1}
            onChange={(n) =>
              setValue("stats.dexterity", n, { shouldValidate: true })
            }
          />
          <NumberInput
            label="Constitution"
            value={Number(stats?.constitution ?? 10)}
            min={1}
            onChange={(n) =>
              setValue("stats.constitution", n, { shouldValidate: true })
            }
          />
          <NumberInput
            label="Intelligence"
            value={Number(stats?.intelligence ?? 10)}
            min={1}
            onChange={(n) =>
              setValue("stats.intelligence", n, { shouldValidate: true })
            }
          />
          <NumberInput
            label="Wisdom"
            value={Number(stats?.wisdom ?? 10)}
            min={1}
            onChange={(n) =>
              setValue("stats.wisdom", n, { shouldValidate: true })
            }
          />
          <NumberInput
            label="Charisma"
            value={Number(stats?.charisma ?? 10)}
            min={1}
            onChange={(n) =>
              setValue("stats.charisma", n, { shouldValidate: true })
            }
          />
        </div>

        {errors.stats && (
          <p className="text-xs text-red-400 mt-2">
            Revisá los campos de stats, hay valores inválidos.
          </p>
        )}
      </div>

      {/* background */}
      <TextAreaField
        label="Background"
        placeholder="Historia corta del personaje..."
        error={errors.background?.message}
        {...register("background")}
      />

      {/* notes */}
      <TextAreaField
        label="Notes"
        placeholder="Notas del DM..."
        error={errors.notes?.message}
        {...register("notes")}
      />

      <button
        disabled={submitDisabled}
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition-colors"
      >
        {loading || isSubmitting ? "Guardando..." : submitLabel}
      </button>

      {error && (
        <p className="text-sm text-red-400 text-center mt-2">{error}</p>
      )}
    </form>
  );
}
