import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CharacterForm from "../components/characters/CharacterForm";
import { getCharacter, updateCharacter } from "../api/mock/characters";
import type { CharacterDTO, CharacterUpsertInput } from "../types/characterTypes";

export default function CharacterEditPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState<CharacterDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const c = await getCharacter(id);
        if (active) setData(c);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Error cargando personaje");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const onSubmit = async (body: CharacterUpsertInput) => {
    if (!id) return;
    setError(null);
    setSaving(true);
    try {
      const updated = await updateCharacter(id, body);
      setData(updated);
      // quedarte en la misma pantalla
      nav(`/characters/${id}/edit`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Editar personaje</h1>
        <Link to="/characters" className="text-sm text-indigo-400 hover:text-indigo-300">
          Volver
        </Link>
      </div>

      {loading && <p className="text-zinc-400">Cargando...</p>}
      {!loading && !data && !error && <p className="text-zinc-400">No se encontró el personaje.</p>}

      {data && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <CharacterForm
            initial={data}
            onSubmit={onSubmit}
            loading={saving}
            error={error}
            submitLabel="Guardar cambios"
          />
        </div>
      )}

      {error && !data && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
}
