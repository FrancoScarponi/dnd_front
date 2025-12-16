import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CampaignDTO } from "../types/campaignTypes";
import { getCampaign } from "../api/campaigns";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<CampaignDTO | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await getCampaign(id);
        if (active) setData(res);
      } catch (err) {
        if (active)
          setError(
            err instanceof Error ? err.message : "Error al cargar campaña"
          );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="bg-zinc-950 text-white px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/campaigns"
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← Volver
        </Link>

        {loading && <p className="text-zinc-400 mt-4">Cargando...</p>}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        {data && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            {/* header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{data.name}</h1>
                {data.description && (
                  <p className="text-zinc-400 mt-2">{data.description}</p>
                )}
              </div>

              <div className="text-right">
                <div className="text-xs text-zinc-400">Invite code</div>
                <div className="font-mono text-sm bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-md">
                  {data.inviteCode}
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="mt-6 flex gap-3">
              <Link
                to={`/campaigns/${data._id}/characters`}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
              >
                Ver personajes
              </Link>

              <Link
                to={`/characters/new?campaign=${data._id}`}
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-600"
              >
                Crear personaje
              </Link>

              <Link
                to={`/campaigns/${data._id}/sessions`}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
              >
                Sesiones
              </Link>
            </div>

            {/* stats */}
            <div className="mt-6 grid gap-2 text-sm text-zinc-300">
              <div>Players: {data.players?.length ?? 0}</div>
              <div>Characters: {data.characters?.length ?? 0}</div>
              <div>Sessions: {data.sessions?.length ?? 0}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
