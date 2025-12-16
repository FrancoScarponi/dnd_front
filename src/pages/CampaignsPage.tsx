import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CampaignDTO, MyCampaignsResponse } from "../types/campaignTypes";
import { listMyCampaigns, deleteCampaign, leaveCampaign } from "../api/campaigns";
import { Trash2, LogOut } from "lucide-react";
import ConfirmDialog from "../components/ui/ConfirmDialog";

type ActionState =
  | { open: false }
  | {
      open: true;
      kind: "delete" | "leave";
      campaignId: string;
      campaignName: string;
    };

export default function CampaignsPage() {
  const [data, setData] = useState<MyCampaignsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [action, setAction] = useState<ActionState>({ open: false });

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
        if (active) setError(err instanceof Error ? err.message : "Error al cargar campañas");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const dmCampaigns = data?.DMCampaigns ?? [];
  const playerCampaigns = data?.playerCampaigns ?? [];

  async function runDelete(campaignId: string) {
    setBusyId(campaignId);
    setError(null);
    try {
      await deleteCampaign(campaignId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la campaña");
    } finally {
      setBusyId(null);
    }
  }

  async function runLeave(campaignId: string) {
    setBusyId(campaignId);
    setError(null);
    try {
      await leaveCampaign(campaignId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo salir de la campaña");
    } finally {
      setBusyId(null);
    }
  }

  const CampaignCard = ({
    c,
    actionNode,
  }: {
    c: CampaignDTO;
    actionNode?: React.ReactNode;
  }) => (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition">
      <div className="flex items-start gap-3 p-4">
        <Link to={`/campaigns/${c._id}`} className="flex-1 min-w-0">
          <div className="text-white font-semibold">{c.name}</div>

          {c.description && (
            <div className="text-sm text-zinc-400 mt-1 line-clamp-2">
              {c.description}
            </div>
          )}

          <div className="mt-3 text-xs text-zinc-500">
            Characters: {c.characters?.length ?? 0} · Sessions: {c.sessions?.length ?? 0}
          </div>
        </Link>

        {actionNode}
      </div>
    </div>
  );

  const renderGrid = (items: CampaignDTO[], kind: "dm" | "player") => (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((c) => {
        const isBusy = busyId === c._id;

        const actionNode =
          kind === "dm" ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAction({
                  open: true,
                  kind: "delete",
                  campaignId: c._id,
                  campaignName: c.name,
                });
              }}
              disabled={isBusy}
              title="Eliminar campaña"
              className="shrink-0 rounded-md border border-zinc-800 bg-zinc-950 p-2 text-red-300 hover:border-red-700 hover:text-red-200 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAction({
                  open: true,
                  kind: "leave",
                  campaignId: c._id,
                  campaignName: c.name,
                });
              }}
              disabled={isBusy}
              title="Salir de la campaña"
              className="shrink-0 rounded-md border border-zinc-800 bg-zinc-950 p-2 text-zinc-200 hover:border-zinc-700 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
            </button>
          );

        return <CampaignCard key={c._id} c={c} actionNode={actionNode} />;
      })}
    </div>
  );

  const dialogOpen = action.open;
  const dialogLoading = action.open && busyId === action.campaignId;

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

        {!loading && !error && (
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-semibold mb-3">Campañas como DM</h2>
              {dmCampaigns.length === 0 ? (
                <p className="text-zinc-400">No tenés campañas como DM.</p>
              ) : (
                renderGrid(dmCampaigns, "dm")
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Campañas como jugador</h2>
              {playerCampaigns.length === 0 ? (
                <p className="text-zinc-400">No tenés campañas como jugador.</p>
              ) : (
                renderGrid(playerCampaigns, "player")
              )}
            </section>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title={
          action.open && action.kind === "delete"
            ? "Eliminar campaña"
            : "Salir de la campaña"
        }
        description={
          action.open && action.kind === "delete"
            ? `Vas a eliminar “${action.campaignName}”. Esta acción no se puede deshacer.`
            : `Vas a salir de “${action.campaignName}”.`
        }
        confirmText={action.open && action.kind === "delete" ? "Eliminar" : "Salir"}
        cancelText="Cancelar"
        destructive={action.open && action.kind === "delete"}
        loading={dialogLoading}
        onClose={() => {
          if (dialogLoading) return;
          setAction({ open: false });
        }}
        onConfirm={async () => {
          if (!action.open) return;
          const id = action.campaignId;

          // cerramos el modal al terminar (o lo podés dejar abierto mientras carga)
          try {
            if (action.kind === "delete") await runDelete(id);
            else await runLeave(id);
          } finally {
            setAction({ open: false });
          }
        }}
      />
    </div>
  );
}
