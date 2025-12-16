import { z } from "zod";

export const sessionFormSchema = z
  .object({

    title: z
      .string()
      .min(3, "Debe tener al menos 3 caracteres")
      .max(200, "No puede superar los 200 caracteres"),

    description: z
      .string()
      .min(
        5,
        "La descripción es obligatoria y debe tener al menos 5 caracteres"
      )
      .max(2000, "La descripción no puede superar los 2000 caracteres"),

    startDate: z.string().min(1, "La fecha de inicio es obligatoria"),

    notesDM: z
      .string()
      .max(5000, "Las notas del DM no pueden superar los 5000 caracteres")
      .optional(),

    notesPlayers: z
      .string()
      .max(
        5000,
        "Las notas para jugadores no pueden superar los 5000 caracteres"
      )
      .optional(),
  })

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
