"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteSermon, listSermons } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import type { Sermon } from "@/lib/types";

export default function SermonesPage() {
  const router = useRouter();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      try {
        const list = await listSermons();
        if (active) setSermons(list);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Error.");
      }
      if (active) setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este sermon?")) return;
    try {
      await deleteSermon(id);
      setSermons(await listSermons());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-900">Mis sermones</h1>
        <Link href="/" className="btn-ghost px-3 py-1.5">
          Ir al chat
        </Link>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loaded ? (
        <p className="text-sm text-stone-500">Cargando...</p>
      ) : sermons.length === 0 ? (
        <p className="text-sm text-stone-500">
          Aun no tienes sermones guardados. Crea uno conversando en el chat y
          pulsa &quot;Abrir como sermon&quot;.
        </p>
      ) : (
        <ul className="space-y-2">
          {sermons.map((s) => (
            <li key={s.id} className="card flex items-center justify-between">
              <div className="min-w-0">
                <Link
                  href={`/sermon/${s.id}`}
                  className="font-medium text-brand-700 hover:underline"
                >
                  {s.title || "Sermon sin titulo"}
                </Link>
                <p className="truncate text-xs text-stone-500">
                  {s.config.scripture || "Sin texto base"} -{" "}
                  {new Date(s.updatedAt).toLocaleDateString("es")}
                </p>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="ml-3 shrink-0 text-xs text-stone-400 hover:text-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
