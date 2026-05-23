import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", auth.user.id)
    .maybeSingle();

  const customerId = profile?.stripe_customer_id as string | undefined;
  if (!customerId) {
    return NextResponse.json({ error: "No tienes una suscripción activa." }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/?planes=portal`,
  });

  return NextResponse.json({ url: session.url });
}
