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
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as Row[]) ?? []).map(toSermon);
}

export async function getSermon(id: string): Promise<Sermon | null> {
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toSermon(data as Row) : null;
}

export async function saveSermon(sermon: Sermon): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Inicia sesion para guardar el sermon.");
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
  if (error) throw new Error(error.message);
}

export async function deleteSermon(id: string): Promise<void> {
  const { error } = await supabase.from("sermons").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function newId(): string {
  return crypto.randomUUID();
}
