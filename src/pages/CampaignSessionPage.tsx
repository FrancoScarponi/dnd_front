import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listCampaignSessions } from "../api/campaignSessions";
import type { SessionDTO } from "../types/sessionTypes";

export default function CampaignSessionsPage() {
  const { id: campaignId } = useParams<{ id: string }>();
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [loading, setLoading] = useState(!!campaignId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    let active = true;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await listCampaignSessions(campaignId);
        if (active) setSessions(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar las sesiones"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [campaignId]);

  return (
    <div className="bg-zinc-950 text-white px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/campaigns/${campaignId}`}
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← Volver a la campaña
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sesiones</h1>

          {campaignId && (
            <Link
              to={`/sessions/new?campaign=${campaignId}`}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
            >
              Crear sesión
            </Link>
          )}
        </div>

        {loading && <p className="mt-4 text-zinc-400">Cargando sesiones...</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 space-y-3">
            {sessions.length === 0 && (
              <p className="text-zinc-400 text-sm">
                Todavía no hay sesiones en esta campaña.
              </p>
            )}

            {sessions.map((s) => (
              <Link
                key={s._id}
                to={`/campaigns/${campaignId}/sessions/${s._id}`}
                className="block rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-700"
              >
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <div className="text-sm text-zinc-400">
                      Sesión #{s.sessionNumber}
                    </div>
                    <div className="text-base font-semibold">{s.title}</div>
                    {s.description && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 text-right">
                    {s.startDate && (
                      <div>
                        Inicio:{" "}
                        {new Date(s.startDate).toLocaleDateString("es-AR")}
                      </div>
                    )}
                    {s.endDate && (
                      <div>
                        Fin:{" "}
                        {new Date(s.endDate).toLocaleDateString("es-AR")}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
