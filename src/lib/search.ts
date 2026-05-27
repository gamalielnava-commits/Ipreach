import type { Sermon } from "./types";
import type { Series } from "./types";
import type { ScheduleEvent } from "./types";

export interface SearchResult {
  type: "sermon" | "series" | "event";
  id: string;
  title: string;
  snippet: string;
  date: string;
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Search error:", err);
    return [];
  }
}

export function filterSermons(sermons: Sermon[], query: string): Sermon[] {
  const q = query.toLowerCase();
  return sermons.filter(s => 
    s.title.toLowerCase().includes(q) ||
    s.config.idea?.toLowerCase().includes(q) ||
    s.config.scripture?.toLowerCase().includes(q) ||
    s.sermonText?.toLowerCase().includes(q)
  );
}

export function filterSeries(series: Series[], query: string): Series[] {
  const q = query.toLowerCase();
  return series.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.subtitle?.toLowerCase().includes(q) ||
    s.description?.toLowerCase().includes(q) ||
    s.tags?.some(t => t.toLowerCase().includes(q))
  );
}
