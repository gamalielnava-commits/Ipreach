-- Ipreach - esquema inicial (fase 2: cuentas y guardado en la nube).
-- Los catalogos (marcos, temas, comentaristas, etc.) viven hoy en el codigo
-- (src/lib/catalogs.ts). Estas tablas guardan los datos del usuario.

create extension if not exists "pgcrypto";

-- Perfil del predicador, extiende auth.users de Supabase.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  default_framework text,
  country text,
  congregation text,
  created_at timestamptz not null default now()
);

-- Sermones del usuario.
create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Sermon',
  config jsonb not null default '{}'::jsonb,
  sermon_text text not null default '',
  outline_text text not null default '',
  status text not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sermons_user_idx on public.sermons (user_id);

-- Versiones del sermon (permite regenerar bajo otro marco sin perder lo anterior).
create table if not exists public.sermon_versions (
  id uuid primary key default gen_random_uuid(),
  sermon_id uuid not null references public.sermons (id) on delete cascade,
  kind text not null default 'completo',
  content text not null default '',
  model_used text,
  created_at timestamptz not null default now()
);
create index if not exists sermon_versions_sermon_idx on public.sermon_versions (sermon_id);

-- Sets de diapositivas generados a partir de un sermon.
create table if not exists public.slide_decks (
  id uuid primary key default gen_random_uuid(),
  sermon_id uuid not null references public.sermons (id) on delete cascade,
  style text not null,
  density text not null,
  content text not null default '',
  image_prompt text,
  created_at timestamptz not null default now()
);
create index if not exists slide_decks_sermon_idx on public.slide_decks (sermon_id);

-- Habilitar Row Level Security: cada usuario solo ve lo suyo.
alter table public.profiles enable row level security;
alter table public.sermons enable row level security;
alter table public.sermon_versions enable row level security;
alter table public.slide_decks enable row level security;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "sermons_own" on public.sermons
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sermon_versions_own" on public.sermon_versions
  for all using (
    exists (select 1 from public.sermons s
            where s.id = sermon_id and s.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.sermons s
            where s.id = sermon_id and s.user_id = auth.uid())
  );

create policy "slide_decks_own" on public.slide_decks
  for all using (
    exists (select 1 from public.sermons s
            where s.id = sermon_id and s.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.sermons s
            where s.id = sermon_id and s.user_id = auth.uid())
  );
