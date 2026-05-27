import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";
    
    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results: any[] = [];

    if (type === "all" || type === "sermons") {
      const { data: sermons, error: sermonError } = await supabase
        .from("sermons")
        .select("id, title, sermon_text, updated_at")
        .eq("user_id", auth.user.id)
        .ilike("title", `%${query}%`);
      
      if (!sermonError && sermons) {
        for (const s of sermons) {
          results.push({
            type: "sermon",
            id: s.id,
            title: s.title,
            snippet: s.sermon_text?.slice(0, 200) || "",
            date: s.updated_at,
          });
        }
      }
    }

    if (type === "all" || type === "series") {
      const { data: series, error: seriesError } = await supabase
        .from("series")
        .select("id, title, subtitle, description, updated_at")
        .eq("user_id", auth.user.id)
        .ilike("title", `%${query}%`);
      
      if (!seriesError && series) {
        for (const s of series) {
          results.push({
            type: "series",
            id: s.id,
            title: s.title,
            snippet: s.description?.slice(0, 200) || s.subtitle || "",
            date: s.updated_at,
          });
        }
      }
    }

    if (type === "all" || type === "events") {
      const { data: events, error: eventsError } = await supabase
        .from("schedule_events")
        .select("id, title, event_date, description")
        .eq("user_id", auth.user.id)
        .ilike("title", `%${query}%`);
      
      if (!eventsError && events) {
        for (const e of events) {
          results.push({
            type: "event",
            id: e.id,
            title: e.title,
            snippet: e.description || "",
            date: e.event_date,
          });
        }
      }
    }

    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json({ results, query });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
