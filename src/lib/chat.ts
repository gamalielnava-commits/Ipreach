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
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as ConvRow[]) ?? []).map(toConversation);
}

export async function createConversation(title: string): Promise<Conversation> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Inicia sesion.");
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: auth.user.id, title: title.slice(0, 80) || "Conversacion" })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toConversation(data as ConvRow);
}

export async function deleteConversation(id: string): Promise<void> {
  const { error } = await supabase.from("conversations").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data as MsgRow[]) ?? []).map((m) => ({
    id: m.id,
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
    createdAt: m.created_at,
  }));
}

export async function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, role, content })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
  const m = data as MsgRow;
  return { id: m.id, role, content: m.content, createdAt: m.created_at };
}
