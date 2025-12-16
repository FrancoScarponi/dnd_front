import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { CharacterDTO } from "../types/characterTypes";
import {
  addCharacterToCampaignMock,
  listAllCharactersMock,
  listCampaignCharactersMock,
  removeCharacterFromCampaignMock,
  getCampaignMock,
} from "../api/mock/campaignCharacters";
import { listCampaignCharacters } from "../api/campaignCharacter";
import { getCampaign } from "../api/campaigns";

export default function CampaignCharactersPage() {
  const { campaignId } = useParams();

  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignChars, setCampaignChars] = useState<CharacterDTO[]>([]);
  const [allChars, setAllChars] = useState<CharacterDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inCampaign = useMemo(
    () => new Set(campaignChars.map((c) => c._id)),
    [campaignChars]
  );

  const allCharsMerged = useMemo(() => {
    const map = new Map<string, CharacterDTO>();

    // primero los globales
    for (const c of allChars) map.set(c._id, c);

    // después los de la campaña (por si faltaban en allChars)
    for (const c of campaignChars) map.set(c._id, c);

    return Array.from(map.values());
  }, [allChars, campaignChars]);

  const load = async () => {
    if (!campaignId) return;
    console.log("Loading campaign characters for campaignId:", campaignId);
    setError(null);
    setLoading(true);
    try {
      const [camp, campChars, all] = await Promise.all([
        getCampaign(campaignId),
        listCampaignCharacters(campaignId),
        listAllCharactersMock(),
      ]);
      setCampaignName(camp.name);
      setCampaignChars(campChars);
      setAllChars(all);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error cargando personajes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [campaignId]);

  const onAdd = async (characterId: string) => {
    if (!campaignId) return;
    setBusyId(characterId);
    try {
      await addCharacterToCampaignMock(campaignId, characterId);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error agregando personaje"
      );
    } finally {
      setBusyId(null);
    }
  };

  const onRemove = async (characterId: string) => {
    if (!campaignId) return;
    setBusyId(characterId);
    try {
      await removeCharacterFromCampaignMock(campaignId, characterId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error quitando personaje");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-zinc-950 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Personajes — {campaignName || "Campaña"}
          </h1>
          <div className="text-xs text-zinc-500 mt-1">
            campaignId: <span className="font-mono">{campaignId}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/campaigns/${campaignId}`}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:border-zinc-700"
          >
            Volver
          </Link>

          <Link
            to="/characters/new"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold hover:bg-indigo-500"
          >
            Crear personaje
          </Link>
        </div>
      </div>

      {loading && <p className="text-zinc-400">Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && (
        <div className="grid gap-8">
          {/* Asignados */}
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Asignados a la campaña
            </h2>

            {campaignChars.length === 0 ? (
              <p className="text-zinc-400">
                Todavía no hay personajes asignados.
              </p>
            ) : (
              <div className="grid gap-3">
                {campaignChars.map((c) => (
                  <div
                    key={c._id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {c.race} · {c.class} · Lv {c.level}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/characters/${c._id}/edit`}
                        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => onRemove(c._id)}
                        disabled={busyId === c._id}
                        className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200 hover:bg-red-950/60 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {busyId === c._id ? "Quitando..." : "Quitar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Agregar */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Agregar existente</h2>
            <p className="text-sm text-zinc-400 mb-3">
              Podés agregar personajes globales (sin campaña) o reasignar uno a
              esta campaña.
            </p>

            <div className="grid gap-3">
              {allCharsMerged.map((c) => {
                const already = inCampaign.has(c._id);

                return (
                  <div
                    key={c._id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {c.race} · {c.class} · Lv {c.level}
                      </div>
                      <div className="text-xs text-zinc-500 mt-2">
                        Campaign:{" "}
                        {c.campaign ? (
                          <span className="font-mono">{c.campaign}</span>
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/characters/${c._id}/edit`}
                        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700"
                      >
                        Ver/Editar
                      </Link>
                      <button
                        onClick={() => onAdd(c._id)}
                        disabled={already || busyId === c._id}
                        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {already
                          ? "Ya asignado"
                          : busyId === c._id
                          ? "Agregando..."
                          : "Agregar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
