import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { priceId } = await req.json() as { priceId: string };
  if (!priceId) {
    return NextResponse.json({ error: "Falta priceId." }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", auth.user.id)
    .maybeSingle();

  const customerId = profile?.stripe_customer_id as string | undefined;
  const origin = req.headers.get("origin") ?? "http://localhost:3000";
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: customerId,
    customer_email: customerId ? undefined : auth.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/?planes=success`,
    cancel_url: `${origin}/?planes=canceled`,
    metadata: { supabase_user_id: auth.user.id },
    subscription_data: { metadata: { supabase_user_id: auth.user.id } },
  });

  return NextResponse.json({ url: session.url });
}
