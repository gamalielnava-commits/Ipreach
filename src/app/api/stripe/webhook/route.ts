import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Configuración incompleta." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  async function updateProfile(userId: string, fields: Record<string, unknown>) {
    await supabaseAdmin.from("profiles").update(fields).eq("id", userId);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (userId) {
        await updateProfile(userId, {
          stripe_customer_id: session.customer,
          subscription_status: "pro",
        });
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.supabase_user_id;
      if (userId) {
        const status = sub.status === "active" ? "pro" : "canceled";
        const endsAt = sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null;
        await updateProfile(userId, {
          subscription_status: status,
          subscription_ends_at: endsAt,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.supabase_user_id;
      if (userId) {
        await updateProfile(userId, {
          subscription_status: "free",
          subscription_ends_at: null,
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
