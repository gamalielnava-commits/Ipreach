import { supabase } from "./supabase";
import type { Sermon, SermonConfig, SlideDeck } from "./types";

interface Row {
  id: string;
  title: string;
  config: SermonConfig;
  sermon_text: string;
  outline_text: string;
  slide_decks: SlideDeck[];
  created_at: string;
  updated_at: string;
}

function toSermon(r: Row): Sermon {
  return {
    id: r.id,
    title: r.title,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    config: r.config,
    sermonText: r.sermon_text,
    outlineText: r.outline_text,
    slideDecks: r.slide_decks ?? [],
  };
}

export async function listSermons(): Promise<Sermon[]> {
  let remote: Sermon[] = [];
  try {
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) {
      remote = (data as Row[]).map(toSermon);
    }
  } catch (err) {
    console.warn("Supabase listSermons failed:", err);
  }

  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_sermons");
    const local: Sermon[] = localStr ? JSON.parse(localStr) : [];
    // Merge by id, keeping remote as priority
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

export async function getSermon(id: string): Promise<Sermon | null> {
  try {
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toSermon(data as Row) : null;
  } catch (err) {
    console.warn("Supabase getSermon failed, using localStorage:", err);
    if (typeof window !== "undefined") {
      const list = await listSermons();
      return list.find((s) => s.id === id) || null;
    }
    return null;
  }
}

export async function saveSermon(sermon: Sermon): Promise<void> {
  let success = false;
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      const { error } = await supabase.from("sermons").upsert({
        id: sermon.id,
        user_id: auth.user.id,
        title: sermon.title,
        config: sermon.config,
        sermon_text: sermon.sermonText,
        outline_text: sermon.outlineText,
        slide_decks: sermon.slideDecks,
        updated_at: new Date().toISOString(),
      });
      if (!error) {
        success = true;
      }
    }
  } catch (err) {
    console.warn("Supabase saveSermon failed:", err);
  }

  // Always write to local storage as well for cache and fallback
  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_sermons");
    const list: Sermon[] = localStr ? JSON.parse(localStr) : [];
    const idx = list.findIndex((s) => s.id === sermon.id);
    sermon.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      list[idx] = sermon;
    } else {
      list.unshift(sermon);
    }
    localStorage.setItem("ipreach_sermons", JSON.stringify(list));
  }
}

export async function deleteSermon(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("sermons").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.warn("Supabase deleteSermon failed:", err);
  }
  // Always also remove from local storage
  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_sermons");
    const list: Sermon[] = localStr ? JSON.parse(localStr) : [];
    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem("ipreach_sermons", JSON.stringify(filtered));
  }
}

export function newId(): string {
  return crypto.randomUUID();
}
