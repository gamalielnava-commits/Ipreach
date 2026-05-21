"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteSermon, listSermons } from "@/lib/store";
import type { Sermon } from "@/lib/types";

export default function HomePage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSermons(listSermons());
    setLoaded(true);
  }, []);

  function handleDelete(id: string) {
    if (!confirm("Eliminar este sermon?")) return;
    deleteSermon(id);
    setSermons(listSermons());
  }

  return (
    <div className="space-y-8">
      <section className="card bg-gradient-to-br from-brand-50 to-white">
        <h1 className="text-2xl font-bold text-stone-900">
          Prepara sermones a nivel profesional
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Elige tu marco doctrinal, el motivo, el tipo de sermon, la estrategia y el
          metodo. Escribe tu idea y la IA te ayuda a desarrollarla, revisarla y
          convertirla en bosquejo y diapositivas.
        </p>
        <Link href="/wizard" className="btn-primary mt-4">
          Crear un sermon
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-stone-800">Mis sermones</h2>
        {!loaded ? (
          <p className="text-sm text-stone-500">Cargando...</p>
        ) : sermons.length === 0 ? (
          <p className="text-sm text-stone-500">
            Aun no tienes sermones. Crea el primero con el boton de arriba.
          </p>
        ) : (
          <ul className="space-y-2">
            {sermons.map((s) => (
              <li key={s.id} className="card flex items-center justify-between">
                <div>
                  <Link
                    href={`/sermon/${s.id}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {s.title || "Sermon sin titulo"}
                  </Link>
                  <p className="text-xs text-stone-500">
                    {s.config.scripture || "Sin texto base"} -{" "}
                    {new Date(s.updatedAt).toLocaleDateString("es")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-xs text-stone-400 hover:text-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
