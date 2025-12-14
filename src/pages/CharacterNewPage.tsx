import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CharacterForm from "../components/characters/CharacterForm";
import { createCharacter } from "../api/mock/characters";
import type { CharacterUpsertInput } from "../types/characterTypes";

export default function CharacterNewPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (body: CharacterUpsertInput) => {
    setError(null);
    setLoading(true);
    try {
      const created = await createCharacter(body);
      nav(`/characters/${created._id}/edit`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando personaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Crear personaje</h1>
        <Link to="/characters" className="text-sm text-indigo-400 hover:text-indigo-300">
          Volver
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <CharacterForm
          initial={null}
          onSubmit={onSubmit}
          loading={loading}
          error={error}
          submitLabel="Crear personaje"
        />
      </div>
    </div>
  );
}
