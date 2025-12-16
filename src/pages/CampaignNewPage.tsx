import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../components/ui/Input";
import { createCampaign } from "../api/campaigns";

import {
  campaignFormSchema,
  CampaignFormValues,
} from "../validation/campaignSchemas";

export default function CampaignNewPage() {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: CampaignFormValues) {
    const created = await createCampaign({
      name: values.name.trim(),
      description: values.description.trim(),
    });

    nav(`/campaigns/${created._id}/characters`, { replace: true });
  }

  return (
    <div className="bg-zinc-950 text-white px-4 py-8">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Nueva campaña</h1>
          <Link
            to="/campaigns"
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Volver
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombre */}
            <div>
              <Input
                label="Nombre"
                placeholder="Curse of Strahd"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* descripcion */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Descripción
              </label>
              <textarea
                {...register("description")}
                className="w-full min-h-[120px] rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="De qué va la campaña..."
              />
              {errors.description && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* boton */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition-colors"
            >
              {isSubmitting ? "Creando..." : "Crear campaña"}
            </button>

            <p className="text-xs text-zinc-500 text-center pt-2">
              Después de crear la campaña vas a poder agregar personajes.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
