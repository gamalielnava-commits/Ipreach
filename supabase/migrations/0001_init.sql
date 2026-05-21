-- Ipreach - esquema inicial.
-- Cada usuario (Supabase Auth) guarda sus sermones en la tabla sermons.
-- Los catalogos (marcos, temas, comentaristas, etc.) viven en el codigo
-- (src/lib/catalogs.ts).

create extension if not exists "pgcrypto";

create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Sermon',
  config jsonb not null default '{}'::jsonb,
  sermon_text text not null default '',
  outline_text text not null default '',
  slide_decks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sermons_user_idx
  on public.sermons (user_id, updated_at desc);

-- Row Level Security: cada usuario solo ve y edita sus propios sermones.
alter table public.sermons enable row level security;

create policy "sermons_select_own" on public.sermons
  for select using (auth.uid() = user_id);
create policy "sermons_insert_own" on public.sermons
  for insert with check (auth.uid() = user_id);
create policy "sermons_update_own" on public.sermons
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sermons_delete_own" on public.sermons
  for delete using (auth.uid() = user_id);
