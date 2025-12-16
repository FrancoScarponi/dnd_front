import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { joinCampaign } from "../api/campaigns";

export default function CampaignJoinPage() {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const code = inviteCode.trim();
    if (!code) {
      setError("Ingresá un código.");
      return;
    }

    setLoading(true);
    try {
      const campaign = await joinCampaign(code);
      navigate(`/campaigns/${campaign._id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo unir a la campaña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-950 text-white px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Unirme a una campaña</h1>
          <Link to="/campaigns" className="text-sm text-indigo-400 hover:text-indigo-300">
            Volver
          </Link>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Código de invitación</label>
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Ej: aSt1ghdx"
              className="w-full rounded-md bg-zinc-950 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition-colors"
          >
            {loading ? "Uniéndome..." : "Unirme"}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            Solicita el codigo de la campaña al DM.
          </p>
        </form>
      </div>
    </div>
  );
}
