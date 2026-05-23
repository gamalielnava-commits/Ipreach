"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getProfile } from "@/lib/profile";

function Spinner() {
  return (
    <div style={{
      minHeight: "100dvh",
      display: "grid",
      placeItems: "center",
      background: "var(--paper)",
      fontFamily: "var(--font-ui)",
    }}>
      <div style={{ textAlign: "center", color: "var(--ink-2)" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid color-mix(in oklab, var(--accent) 30%, var(--paper-2))",
          borderTopColor: "var(--accent)",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px",
        }} />
        <p className="eyebrow">Conectando tu cuenta…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    async function handle() {
      const code = params.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      await new Promise((r) => setTimeout(r, 400));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const profile = await getProfile();
      if (!profile?.onboarded) {
        router.replace("/onboarding");
      } else {
        router.replace("/");
      }
    }

    handle();
  }, [params, router]);

  return <Spinner />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackHandler />
    </Suspense>
  );
}
