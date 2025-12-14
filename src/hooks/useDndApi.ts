import { useEffect, useState } from "react";
import { dndGet } from "../api/dnd5e.client";
import type { ListResponse, ClassDetail, RaceDetail } from "../types/dnd5e";

export function useDndClasses() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchClasses() {
      try {
        setLoading(true);
        const res = await dndGet<ListResponse>("/classes");
        if (active) setData(res);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Error al cargar clases");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchClasses();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

export function useDndClass(index?: string) {
  const [data, setData] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!index) return;

    let active = true;

    async function fetchClass() {
      try {
        setLoading(true);
        const res = await dndGet<ClassDetail>(`/classes/${index}`);
        if (active) setData(res);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Error al cargar clase");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchClass();
    return () => {
      active = false;
    };
  }, [index]);

  return { data, loading, error };
}

export function useDndRaces() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchRaces() {
      try {
        setLoading(true);
        const res = await dndGet<ListResponse>("/races");
        if (active) setData(res);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Error al cargar razas");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchRaces();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

export function useDndRace(index?: string) {
  const [data, setData] = useState<RaceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!index) return;

    let active = true;

    async function fetchRace() {
      try {
        setLoading(true);
        const res = await dndGet<RaceDetail>(`/races/${index}`);
        if (active) setData(res);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Error al cargar raza");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchRace();
    return () => {
      active = false;
    };
  }, [index]);

  return { data, loading, error };
}
