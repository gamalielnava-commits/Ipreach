import { supabase } from "./supabase";
import type { Profile, ProfileDefaults, SubscriptionStatus } from "./types";

interface Row {
  id: string;
  display_name: string;
  role: string;
  country: string;
  framework: string;
  church_name: string;
  church_context: string;
  defaults: ProfileDefaults;
  onboarded: boolean;
  stripe_customer_id?: string;
  subscription_status?: string;
  subscription_ends_at?: string;
  is_admin?: boolean;
}

function toProfile(r: Row): Profile {
  return {
    id: r.id,
    displayName: r.display_name,
    role: r.role,
    country: r.country,
    framework: r.framework,
    churchName: r.church_name ?? "",
    churchContext: r.church_context ?? "",
    defaults: r.defaults ?? {},
    onboarded: r.onboarded,
    stripeCustomerId: r.stripe_customer_id,
    subscriptionStatus: (r.subscription_status as SubscriptionStatus) ?? "free",
    subscriptionEndsAt: r.subscription_ends_at,
    isAdmin: r.is_admin ?? false,
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

type ProfileInput = Omit<Profile, "id" | "stripeCustomerId" | "subscriptionStatus" | "subscriptionEndsAt" | "isAdmin">;

export async function saveProfile(profile: ProfileInput): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Inicia sesion.");
  const { error } = await supabase.from("profiles").upsert({
    id: auth.user.id,
    display_name: profile.displayName,
    role: profile.role,
    country: profile.country,
    framework: profile.framework,
    church_name: profile.churchName,
    church_context: profile.churchContext,
    defaults: profile.defaults,
    onboarded: profile.onboarded,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
