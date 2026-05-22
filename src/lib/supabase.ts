import { createClient } from "@supabase/supabase-js";

// La URL y la clave publicable de Supabase son seguras de exponer en el
// cliente: estan protegidas por Row Level Security. Por eso se incluyen
// como valores por defecto y la app funciona sin configurar variables de
// entorno. Las variables NEXT_PUBLIC_* permiten apuntar a otro proyecto.
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://jasooiomhpxhivftnopp.supabase.co";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_HBxBlL2Jrr-QrEJte1dTKg_IqUe7Z4b";

export const supabaseConfigured = true;

export const supabase = createClient(url, key);
