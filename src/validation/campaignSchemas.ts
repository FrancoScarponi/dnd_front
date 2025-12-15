import { z } from "zod";

export const campaignFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),

  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .min(5, "Debe tener al menos 5 caracteres"),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;
