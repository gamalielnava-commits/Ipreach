"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setMessage(
            "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesion.",
          );
          setMode("login");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticacion.");
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <div className="card space-y-4">
        <h1 className="text-xl font-bold text-stone-900">
          {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
        </h1>
        <p className="text-sm text-stone-500">
          Tus sermones se guardan en tu cuenta y los puedes abrir desde
          cualquier dispositivo.
        </p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Correo electronico</label>
            <input
              type="email"
              required
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Contrasena</label>
            <input
              type="password"
              required
              minLength={6}
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-lg bg-green-50 p-2 text-sm text-green-700">
              {message}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy
              ? "Procesando..."
              : mode === "login"
                ? "Entrar"
                : "Crear cuenta"}
          </button>
        </form>
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setMessage("");
          }}
          className="text-sm text-brand-700 hover:underline"
        >
          {mode === "login"
            ? "No tienes cuenta? Crear una"
            : "Ya tienes cuenta? Iniciar sesion"}
        </button>
      </div>
    </div>
  );
}
