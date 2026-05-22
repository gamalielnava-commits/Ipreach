import { supabase } from "./supabase";
import type { Profile, ProfileDefaults } from "./types";

interface Row {
  id: string;
  display_name: string;
  role: string;
  country: string;
  framework: string;
  defaults: ProfileDefaults;
  onboarded: boolean;
}

function toProfile(r: Row): Profile {
  return {
    id: r.id,
    displayName: r.display_name,
    role: r.role,
    country: r.country,
    framework: r.framework,
    defaults: r.defaults ?? {},
    onboarded: r.onboarded,
  };
}

export async function getProfile(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toProfile(data as Row) : null;
}

export async function saveProfile(profile: Omit<Profile, "id">): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Inicia sesion.");
  const { error } = await supabase.from("profiles").upsert({
    id: auth.user.id,
    display_name: profile.displayName,
    role: profile.role,
    country: profile.country,
    framework: profile.framework,
    defaults: profile.defaults,
    onboarded: profile.onboarded,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
