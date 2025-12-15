import { z } from "zod";

export const sessionFormSchema = z
  .object({
    sessionNumber: z.coerce.number().int().min(1, "Debe ser mínimo 1"),

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

    endDate: z.string().min(1, "La fecha de fin es obligatoria"),

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

  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "La fecha de fin no puede ser anterior a la fecha de inicio",
      path: ["endDate"],
    }
  );

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
