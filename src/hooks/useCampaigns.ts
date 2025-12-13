import { useEffect, useState } from "react";
import type { CampaignDTO } from "../types/campaignTypes";
import { listMyCampaigns, createCampaign as apiCreateCampaign, getCampaign as apiGetCampaign } from "../api/campaigns";

export function useCampaignsList() {
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
        if (active) setError(err instanceof Error ? err.message : "Error al cargar campañas");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error, refresh };
}

export function useCreateCampaign() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (body: { name: string; description?: string }) => {
    setError(null);
    setLoading(true);
    try {
      return await apiCreateCampaign(body);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error creando campaña";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error };
}

export function useCampaignDetail(id?: string) {
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
        const res = await apiGetCampaign(id);
        if (active) setData(res);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Error al cargar campaña");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  return { data, loading, error };
}
