import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { SessionDTO } from "../types/sessionTypes";
import {
  getSession,
  startSession,
  pauseSession,
  endSession,
} from "../api/campaignSessions";
import { Play, Pause, Square } from "lucide-react";

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-AR");
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  const map: Record<string, string> = {
    CREATED: "bg-zinc-700 text-zinc-200",
    STARTED: "bg-emerald-600 text-white",
    PAUSED: "bg-yellow-500 text-black",
    ENDED: "bg-red-600 text-white",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        map[status] ?? "bg-zinc-700 text-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
      <div className="mt-2 text-sm text-zinc-300 whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

export default function SessionDetailPage() {
  const { id: campaignId, sessionId } = useParams<{
    id: string;
    sessionId: string;
  }>();

  const [session, setSession] = useState<SessionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<
    "start" | "pause" | "end" | null
  >(null);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!sessionId) {
        setError("Sesión no encontrada.");
        setLoading(false);
        return;
      }

      try {
        const data = await getSession(sessionId);
        if (active) setSession(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error al cargar la sesión"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [sessionId]);

  const prettyDate = formatDate(session?.startDate);
  const busy = actionLoading !== null;

  async function handleStart() {
    if (!sessionId) return;
    setError(null);
    setActionLoading("start");
    try {
      const updated = await startSession(sessionId);
      setSession(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar la sesión"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handlePause() {
    if (!sessionId) return;
    setError(null);
    setActionLoading("pause");
    try {
      const updated = await pauseSession(sessionId);
      setSession(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo pausar la sesión"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleEnd() {
    if (!sessionId) return;
    setError(null);
    setActionLoading("end");
    try {
      const updated = await endSession(sessionId);
      setSession(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo finalizar la sesión"
      );
    } finally {
      setActionLoading(null);
    }
  }

  const status = session?.status;

  const disableStart = busy || status === "completed";
  const disablePause = busy || status !== "ongoing";
  const disableEnd = busy || status === "completed";

  return (
    <div className="bg-zinc-950 text-white px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to={campaignId ? `/campaigns/${campaignId}/sessions` : "/campaigns"}
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← Volver a sesiones
        </Link>

        {loading && <p className="mt-6 text-zinc-400">Cargando...</p>}
        {error && <p className="mt-6 text-red-400">{error}</p>}

        {!loading && !error && session && (
          <div className="mt-6 space-y-4">
            {/* CARD PRINCIPAL */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold">{session.title}</h1>
                    <StatusBadge status={status} />
                    {prettyDate && (
                      <span className="text-xs text-zinc-400">{prettyDate}</span>
                    )}
                  </div>

                  {session.description ? (
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap max-w-prose">
                      {session.description}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">
                      Sin descripción.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={disableStart}
                    className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-emerald-300 hover:border-emerald-700 hover:text-emerald-200 disabled:opacity-40"
                    title="Iniciar"
                  >
                    <Play className="h-4 w-4" />
                    Start
                  </button>

                  <button
                    type="button"
                    onClick={handlePause}
                    disabled={disablePause}
                    className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-yellow-300 hover:border-yellow-700 hover:text-yellow-200 disabled:opacity-40"
                    title="Pausar"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </button>

                  <button
                    type="button"
                    onClick={handleEnd}
                    disabled={disableEnd}
                    className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-red-300 hover:border-red-700 hover:text-red-200 disabled:opacity-40"
                    title="Finalizar"
                  >
                    <Square className="h-4 w-4" />
                    End
                  </button>
                </div>
              </div>

              {busy && (
                <div className="mt-3 text-xs text-zinc-400 animate-pulse">
                  Actualizando estado de la sesión…
                </div>
              )}
            </div>

            <Section title="Notas del DM">
              {session.notesDM?.trim() ? session.notesDM : "Sin notas del DM."}
            </Section>

            <Section title="Notas para jugadores">
              {session.notesPlayers?.trim()
                ? session.notesPlayers
                : "Sin notas para jugadores."}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
