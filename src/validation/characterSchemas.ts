import { z } from "zod";

export const characterFormSchema = z.object({
  campaign: z.string().nullable().optional(),

  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres"),

  class: z.string().min(1, "La clase es obligatoria"),

  race: z.string().min(1, "La raza es obligatoria"),

  level: z.coerce
    .number()
    .int()
    .min(1, "El nivel mínimo es 1")
    .max(20, "El nivel máximo es 20"),

  xp: z.coerce
    .number()
    .int()
    .min(0, "La XP no puede ser negativa"),

  stats: z.object({
    hp: z.coerce.number().int().min(0, "HP no puede ser negativo"),
    maxHp: z.coerce.number().int().min(0, "Max HP no puede ser negativo"),
    ac: z.coerce.number().int().min(0, "AC no puede ser negativo"),
    strength: z.coerce.number().int().min(1).max(30),
    dexterity: z.coerce.number().int().min(1).max(30),
    constitution: z.coerce.number().int().min(1).max(30),
    intelligence: z.coerce.number().int().min(1).max(30),
    wisdom: z.coerce.number().int().min(1).max(30),
    charisma: z.coerce.number().int().min(1).max(30),
  }),

  armorClass: z.coerce.number().int().min(0).optional(),

  skills: z.record(z.string(), z.number().int()).default({}),

  equipment: z.array(z.string()).default([]),

  background: z.string().default(""),

  notes: z.string().default(""),
});

export type CharacterFormValues = z.infer<typeof characterFormSchema>;
