import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CampaignDTO } from "../types/campaignTypes";
import { listMyCampaigns } from "../api/mock/campaign";

export default function CampaignsPage() {
  const [data, setData] = useState<CampaignDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    setLoading(true);
    try {
      setData(await listMyCampaigns());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar campañas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listMyCampaigns();
        if (active) setData(res);
      } catch (err) {
        if (active)
          setError(
            err instanceof Error ? err.message : "Error al cargar campañas"
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-zinc-950 text-white px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold">Mis campañas</h1>

          <div className="flex gap-2">
            <button
              onClick={refresh}
              className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:border-zinc-700"
            >
              Refrescar
            </button>

            <Link
              to="/campaigns/new"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold hover:bg-indigo-500"
            >
              Nueva campaña
            </Link>
          </div>
        </div>

        {loading && <p className="text-zinc-400">Cargando...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && data && data.length === 0 && (
          <p className="text-zinc-400">No tenés campañas todavía.</p>
        )}

        {!loading && data && data.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.map((c) => (
              <Link
                key={c._id}
                to={`/campaigns/${c._id}`}
                className="block rounded-lg border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition"
              >
                <div className="text-white font-semibold">{c.name}</div>
                {c.description && (
                  <div className="text-sm text-zinc-400 mt-1 line-clamp-2">
                    {c.description}
                  </div>
                )}
                <div className="mt-3 text-xs text-zinc-500">
                  Characters: {c.characters?.length ?? 0} · Sessions:{" "}
                  {c.sessions?.length ?? 0}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
