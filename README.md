# Ipreach

Aplicacion web para preparar sermones a nivel profesional con IA.

## Que hace el MVP

- Asistente paso a paso: idea del sermon, marco doctrinal, temas, motivo,
  tipo, estrategia, metodo, comentaristas, ilustraciones y longitud.
- Generacion del sermon con Claude (Opus) o Gemini, a eleccion.
- Editor para revisar y editar el sermon.
- Generacion de bosquejo a partir del sermon.
- Generacion de diapositivas con estilos prediseñados (Hillsong, Elevation,
  arcilla, comics, realista, cinematografico) y densidad corta/mediana/larga.
- Exportacion del sermon a Word (.docx) y PDF, y de las diapositivas a
  PowerPoint (.pptx).
- Imagenes para redes sociales: sugiere frases del sermon y genera
  imagenes con Gemini (requiere GOOGLE_API_KEY).

Los sermones se guardan en el navegador (localStorage). El guardado en la
nube con cuentas llega en la fase 2 (ver `supabase/migrations`).

## Como ejecutarlo

1. Instalar dependencias:

   ```
   npm install
   ```

2. Copiar `.env.example` a `.env.local` y poner al menos una clave de IA
   (`ANTHROPIC_API_KEY` o `GOOGLE_API_KEY`).

3. Arrancar en desarrollo:

   ```
   npm run dev
   ```

   Abrir http://localhost:3000

## Estructura

- `src/lib/catalogs.ts` - catalogos editables (marcos, temas, metodos, etc.).
- `src/lib/prompt.ts` - construccion de los prompts de IA.
- `src/app/api/generate` - llamada a Claude / Gemini.
- `src/app/wizard` - asistente de creacion.
- `src/app/sermon/[id]` - editor de sermon, bosquejo y diapositivas.
- `supabase/migrations` - esquema para la fase 2 (cuentas en la nube).
