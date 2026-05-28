import { supabase } from "./supabase";
import type { Series, SeriesPart } from "./types";

interface SeriesRow {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  description: string;
  scripture_reference: string;
  cover_style: string;
  total_parts: number;
  completed_parts: number;
  status: string;
  next_scheduled_date?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface SeriesPartRow {
  id: string;
  series_id: string;
  sermon_id?: string;
  part_number: number;
  title: string;
  scripture: string;
  scheduled_date?: string;
  delivered_date?: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

function toSeries(r: SeriesRow): Series {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    scriptureReference: r.scripture_reference,
    coverStyle: r.cover_style,
    totalParts: r.total_parts,
    completedParts: r.completed_parts,
    status: r.status as "draft" | "active" | "completed",
    nextScheduledDate: r.next_scheduled_date,
    tags: r.tags || [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toSeriesPart(r: SeriesPartRow): SeriesPart {
  return {
    id: r.id,
    seriesId: r.series_id,
    sermonId: r.sermon_id,
    partNumber: r.part_number,
    title: r.title,
    scripture: r.scripture,
    scheduledDate: r.scheduled_date,
    deliveredDate: r.delivered_date,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function listSeries(): Promise<Series[]> {
  let remote: Series[] = [];
  try {
    const { data, error } = await supabase
      .from("series")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) {
      remote = (data as SeriesRow[]).map(toSeries);
    }
  } catch (err) {
    console.warn("Supabase listSeries failed:", err);
  }

  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_series");
    const local: Series[] = localStr ? JSON.parse(localStr) : [];
    const merged = [...remote];
    for (const loc of local) {
      if (!merged.some(r => r.id === loc.id)) {
        merged.push(loc);
      }
    }
    merged.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return merged;
  }
  return remote;
}

export async function getSeries(id: string): Promise<Series | null> {
  try {
    const { data, error } = await supabase
      .from("series")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toSeries(data as SeriesRow) : null;
  } catch (err) {
    console.warn("Supabase getSeries failed:", err);
    if (typeof window !== "undefined") {
      const list = await listSeries();
      return list.find((s) => s.id === id) || null;
    }
    return null;
  }
}

export async function saveSeries(series: Series): Promise<void> {
  let success = false;
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      const { error } = await supabase.from("series").upsert({
        id: series.id,
        user_id: auth.user.id,
        title: series.title,
        subtitle: series.subtitle,
        description: series.description,
        scripture_reference: series.scriptureReference,
        cover_style: series.coverStyle,
        total_parts: series.totalParts,
        completed_parts: series.completedParts,
        status: series.status,
        next_scheduled_date: series.nextScheduledDate,
        tags: series.tags,
        updated_at: new Date().toISOString(),
      });
      if (!error) success = true;
    }
  } catch (err) {
    console.warn("Supabase saveSeries failed:", err);
  }

  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_series");
    const list: Series[] = localStr ? JSON.parse(localStr) : [];
    const idx = list.findIndex((s) => s.id === series.id);
    const updated = { ...series, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    localStorage.setItem("ipreach_series", JSON.stringify(list));
  }
}

export async function deleteSeries(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("series").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.warn("Supabase deleteSeries failed:", err);
  }
  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_series");
    const list: Series[] = localStr ? JSON.parse(localStr) : [];
    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem("ipreach_series", JSON.stringify(filtered));
  }
}

export async function listSeriesParts(seriesId: string): Promise<SeriesPart[]> {
  try {
    const { data, error } = await supabase
      .from("series_parts")
      .select("*")
      .eq("series_id", seriesId)
      .order("part_number", { ascending: true });
    if (error) throw new Error(error.message);
    return (data as SeriesPartRow[]).map(toSeriesPart);
  } catch (err) {
    console.warn("Supabase listSeriesParts failed:", err);
    return [];
  }
}

export async function saveSeriesPart(part: SeriesPart): Promise<void> {
  try {
    const { error } = await supabase.from("series_parts").upsert({
      id: part.id,
      series_id: part.seriesId,
      sermon_id: part.sermonId,
      part_number: part.partNumber,
      title: part.title,
      scripture: part.scripture,
      scheduled_date: part.scheduledDate,
      delivered_date: part.deliveredDate,
      notes: part.notes,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.warn("Supabase saveSeriesPart failed:", err);
  }
}

export async function deleteSeriesPart(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("series_parts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.warn("Supabase deleteSeriesPart failed:", err);
  }
}

export function newSeriesId(): string {
  return crypto.randomUUID();
}
