import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CharacterDTO } from "../types/characterTypes";
import { listCharacters } from "../api/mock/characters";

function CharacterRow({ c }: { c: CharacterDTO }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 flex items-start justify-between gap-4">
      <div>
        <div className="text-white font-semibold">{c.name}</div>
        <div className="text-sm text-zinc-400 mt-1">
          {c.race} · {c.class} · Lv {c.level} · XP {c.xp}
        </div>
        <div className="text-xs text-zinc-500 mt-2">
          Campaign: {c.campaign ? <span className="font-mono">{c.campaign}</span> : "—"}
        </div>
      </div>

      <Link
        to={`/characters/${c._id}/edit`}
        className="shrink-0 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700"
      >
        Editar
      </Link>
    </div>
  );
}

export default function CharactersPage() {
  const [data, setData] = useState<CharacterDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      setData(await listCharacters());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar personajes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-zinc-950 text-white">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Personajes</h1>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:border-zinc-700"
          >
            Refrescar
          </button>

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

      {!loading && data && data.length === 0 && (
        <p className="text-zinc-400">No tenés personajes todavía.</p>
      )}

      {!loading && data && data.length > 0 && (
        <div className="grid gap-3">
          {data.map((c) => (
            <CharacterRow key={c._id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
