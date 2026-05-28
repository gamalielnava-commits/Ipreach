import { supabase } from "./supabase";
import type { ChatMessage, Conversation } from "./types";

interface ConvRow {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface MsgRow {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

function toConversation(c: ConvRow): Conversation {
  return {
    id: c.id,
    title: c.title,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

export async function listConversations(): Promise<Conversation[]> {
  let remote: Conversation[] = [];
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) {
      remote = (data as ConvRow[]).map(toConversation);
    }
  } catch (err) {
    console.warn("Supabase listConversations failed:", err);
  }

  if (typeof window !== "undefined") {
    const localStr = localStorage.getItem("ipreach_conversations");
    const local: Conversation[] = localStr ? JSON.parse(localStr) : [];
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

export async function createConversation(title: string): Promise<Conversation> {
  let success = false;
  let newConv: Conversation | null = null;
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      const { data, error } = await supabase
        .from("conversations")
        .insert({ user_id: auth.user.id, title: title.slice(0, 80) || "Conversación" })
        .select("*")
        .single();
      if (!error && data) {
        newConv = toConversation(data as ConvRow);
        success = true;
      }
    }
  } catch (err) {
    console.warn("Supabase createConversation failed, using localStorage:", err);
  }

  if (!success || !newConv) {
    newConv = {
      id: crypto.randomUUID(),
      title: title.slice(0, 80) || "Conversación",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      const list = await listConversations();
      list.unshift(newConv);
      localStorage.setItem("ipreach_conversations", JSON.stringify(list));
    }
  }
  return newConv;
}

export async function deleteConversation(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.warn("Supabase deleteConversation failed:", err);
  }
  // Always also clean from local storage
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("ipreach_conversations");
    const list: Conversation[] = local ? JSON.parse(local) : [];
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem("ipreach_conversations", JSON.stringify(filtered));
    localStorage.removeItem(`ipreach_messages_${id}`);
  }
}

export async function listMessages(conversationId: string): Promise<ChatMessage[]> {
  let remote: ChatMessage[] = [];
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (!error && data) {
      remote = (data as MsgRow[]).map((m) => ({
        id: m.id,
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
        createdAt: m.created_at,
      }));
    }
  } catch (err) {
    console.warn("Supabase listMessages failed:", err);
  }

  // If remote has messages, return them. Otherwise check localStorage.
  if (remote.length === 0 && typeof window !== "undefined") {
    const local = localStorage.getItem(`ipreach_messages_${conversationId}`);
    return local ? JSON.parse(local) : [];
  }
  return remote;
}

export async function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
): Promise<ChatMessage> {
  let success = false;
  let newMsg: ChatMessage | null = null;
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, role, content })
      .select("*")
      .single();
    if (!error && data) {
      const m = data as MsgRow;
      newMsg = { id: m.id, role: role, content: m.content, createdAt: m.created_at };
      success = true;
      
      // Update updated_at of the conversation in Supabase
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    }
  } catch (err) {
    console.warn("Supabase addMessage failed:", err);
  }

  // Always keep localStorage updated as well
  if (typeof window !== "undefined") {
    const localKey = `ipreach_messages_${conversationId}`;
    const local = localStorage.getItem(localKey);
    const list: ChatMessage[] = local ? JSON.parse(local) : [];
    
    const msgToAdd = newMsg || {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date().toISOString(),
    };
    
    if (!list.some(x => x.id === msgToAdd.id)) {
      list.push(msgToAdd);
      localStorage.setItem(localKey, JSON.stringify(list));
    }

    // Also update conversations updatedAt list in localStorage
    const convsStr = localStorage.getItem("ipreach_conversations");
    const convs: Conversation[] = convsStr ? JSON.parse(convsStr) : [];
    const c = convs.find((x) => x.id === conversationId);
    if (c) {
      c.updatedAt = new Date().toISOString();
      localStorage.setItem("ipreach_conversations", JSON.stringify(convs));
    } else {
      // If the conversation is not in local storage, add it
      try {
        const { data: convData } = await supabase.from("conversations").select("*").eq("id", conversationId).single();
        if (convData) {
          convs.push(toConversation(convData));
          localStorage.setItem("ipreach_conversations", JSON.stringify(convs));
        }
      } catch (e) {
        // ignore
      }
    }
    
    if (!newMsg) {
      newMsg = msgToAdd;
    }
  }
  return newMsg!;
}
