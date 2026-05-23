"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UserMenu() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!ready) return null;

  if (!email) {
    return (
      <Link href="/login" className="text-sm text-stone-600 hover:text-brand-700">
        Entrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-stone-500 sm:inline">{email}</span>
      <Link href="/settings" className="text-stone-600 hover:text-brand-700">
        Configuración
      </Link>
      <button
        onClick={signOut}
        className="text-stone-600 hover:text-brand-700"
      >
        Salir
      </button>
    </div>
  );
}
