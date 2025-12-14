import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import { createCampaign } from "../api/mock/campaign";

export default function CampaignNewPage() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (!cleanName) {
      setError("El nombre es obligatorio");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const created = await createCampaign({
        name: cleanName,
        description: cleanDescription ? cleanDescription : undefined,
      });

      // ✅ después de crear, vas directo a asignar/crear personajes
      nav(`/campaigns/${created._id}/characters`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando campaña");
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Curse of Strahd"
              required
            />

            <div className="space-y-1">
              <label className="block text-sm text-zinc-400">Descripción</label>
              <textarea
                className="w-full min-h-[120px] rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="De qué va la campaña..."
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition-colors"
            >
              {loading ? "Creando..." : "Crear campaña"}
            </button>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <p className="text-xs text-zinc-500 text-center pt-2">
              Después de crear la campaña vas a poder agregar personajes.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
