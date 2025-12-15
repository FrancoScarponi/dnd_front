import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCampaignSession } from "../api/campaignSessions";
import {
  sessionFormSchema,
  SessionFormValues,
} from "../validation/sessionSchemas";

export default function NewSessionPage() {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("campaign");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      sessionNumber: 1,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      notesDM: "",
      notesPlayers: "",
    },
  });

  if (!campaignId) {
    return <p className="text-red-400">Falta ?campaign=ID</p>;
  }

  async function onSubmit(values: SessionFormValues) {
    if(!campaignId) return
    await createCampaignSession(campaignId, {
      ...values,
      description: values.description || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      notesDM: values.notesDM || undefined,
      notesPlayers: values.notesPlayers || undefined,
    });

    navigate(`/campaigns/${campaignId}/sessions`);
  }

  return (
    <div className="bg-zinc-950 text-white px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/campaigns/${campaignId}/sessions`}
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← Volver a sesiones
        </Link>

        <h1 className="mt-4 text-2xl font-bold">Crear nueva sesión</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4"
        >
          {/* nro */}
          <div>
            <label className="block text-sm mb-1">Número de sesión</label>
            <input
              type="number"
              {...register("sessionNumber")}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-md"
            />
            {errors.sessionNumber && (
              <p className="text-red-400 text-xs mt-1">
                {errors.sessionNumber.message}
              </p>
            )}
          </div>

          {/* titulo */}
          <div>
            <label className="block text-sm mb-1">Título</label>
            <input
              type="text"
              {...register("title")}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-md"
              placeholder="La noche en que Strahd sonrió..."
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* desc */}
          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-md"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Fecha inicio</label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-md"
              />
              {errors.startDate && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Fecha fin</label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-md"
              />
              {errors.endDate && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* ntoas */}
          <div>
            <label className="block text-sm mb-1">Notas del DM</label>
            <textarea
              rows={4}
              {...register("notesDM")}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-md"
            />
            {errors.notesDM && (
              <p className="text-red-400 text-xs mt-1">
                {errors.notesDM.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Notas para jugadores</label>
            <textarea
              rows={3}
              {...register("notesPlayers")}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-md"
            />
            {errors.notesPlayers && (
              <p className="text-red-400 text-xs mt-1">
                {errors.notesPlayers.message}
              </p>
            )}
          </div>

          {/* botones */}
          <div className="flex justify-end gap-3 pt-3">
            <Link
              to={`/campaigns/${campaignId}/sessions`}
              className="text-sm text-zinc-400 hover:text-zinc-200"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Creando..." : "Crear sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
