import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data: userRes, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userRes.user) {
    return NextResponse.json({ error: "Sesion invalida." }, { status: 401 });
  }
  const userId = userRes.user.id;

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id, subscription_status")
    .eq("id", userId)
    .maybeSingle();

  const customerId = profile?.stripe_customer_id as string | undefined;
  if (customerId) {
    try {
      const stripe = getStripe();
      const subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 10 });
      for (const sub of subs.data) {
        if (sub.status !== "canceled") {
          await stripe.subscriptions.cancel(sub.id);
        }
      }
    } catch (err) {
      console.error("Stripe cancel error (continuing with deletion):", err);
    }
  }

  await admin.from("profiles").delete().eq("id", userId);

  const { error: delErr } = await admin.auth.admin.deleteUser(userId);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
