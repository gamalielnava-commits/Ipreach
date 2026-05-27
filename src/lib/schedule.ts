import { supabase } from "./supabase";
import type { ScheduleEvent } from "./types";

interface ScheduleEventRow {
  id: string;
  user_id: string;
  title: string;
  event_date: string;
  type: string;
  description: string;
  scripture: string;
  series_id?: string;
  sermon_id?: string;
  created_at: string;
  updated_at: string;
}

function toScheduleEvent(r: ScheduleEventRow): ScheduleEvent {
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title,
    eventDate: r.event_date,
    type: r.type as "sermon" | "devocional" | "clase" | "otro",
    description: r.description,
    scripture: r.scripture,
    seriesId: r.series_id,
    sermonId: r.sermon_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function listScheduleEvents(year: number, month: number): Promise<ScheduleEvent[]> {
  let remote: ScheduleEvent[] = [];
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const to = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      
      const { data, error } = await supabase
        .from("schedule_events")
        .select("*")
        .gte("event_date", from)
        .lte("event_date", to)
        .order("event_date", { ascending: true });
      
      if (!error && data) {
        remote = (data as ScheduleEventRow[]).map(toScheduleEvent);
      }
    }
  } catch (err) {
    console.warn("Supabase listScheduleEvents failed:", err);
  }

  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_schedule_events");
    const local: ScheduleEvent[] = localStr ? JSON.parse(localStr) : [];
    const filtered = local.filter(ev => {
      const [ey, em] = ev.eventDate.split("-").map(Number);
      return ey === year && em === month + 1;
    });
    
    const merged = [...remote];
    for (const loc of filtered) {
      if (!merged.some(r => r.id === loc.id)) {
        merged.push(loc);
      }
    }
    merged.sort((a, b) => a.eventDate.localeCompare(b.eventDate));
    return merged;
  }
  return remote;
}

export async function saveScheduleEvent(event: ScheduleEvent): Promise<ScheduleEvent> {
  let success = false;
  let savedEvent: ScheduleEvent | null = null;
  
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      const { data, error } = await supabase.from("schedule_events").upsert({
        id: event.id || crypto.randomUUID(),
        user_id: auth.user.id,
        title: event.title,
        event_date: event.eventDate,
        type: event.type,
        description: event.description,
        scripture: event.scripture,
        series_id: event.seriesId,
        sermon_id: event.sermonId,
        updated_at: new Date().toISOString(),
      }).select("*").single();
      
      if (!error && data) {
        savedEvent = toScheduleEvent(data as ScheduleEventRow);
        success = true;
      }
    }
  } catch (err) {
    console.warn("Supabase saveScheduleEvent failed:", err);
  }

  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_schedule_events");
    const list: ScheduleEvent[] = localStr ? JSON.parse(localStr) : [];
    const eventToSave = savedEvent || { ...event, id: event.id || crypto.randomUUID() };
    const idx = list.findIndex((e) => e.id === eventToSave.id);
    if (idx >= 0) {
      list[idx] = eventToSave;
    } else {
      list.push(eventToSave);
    }
    localStorage.setItem("ipreach_schedule_events", JSON.stringify(list));
  }
  
  return savedEvent || event;
}

export async function deleteScheduleEvent(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("schedule_events").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.warn("Supabase deleteScheduleEvent failed:", err);
  }
  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_schedule_events");
    const list: ScheduleEvent[] = localStr ? JSON.parse(localStr) : [];
    const filtered = list.filter((e) => e.id !== id);
    localStorage.setItem("ipreach_schedule_events", JSON.stringify(filtered));
  }
}

export function newScheduleEventId(): string {
  return crypto.randomUUID();
}
