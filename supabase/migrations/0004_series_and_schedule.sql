-- Tabla de series de sermones
create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  subtitle text default '',
  description text default '',
  scripture_reference text default '',
  cover_style text default 'deck-hillsong',
  total_parts int not null default 1,
  completed_parts int not null default 0,
  status text not null default 'draft', -- draft, active, completed
  next_scheduled_date date,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists series_user_idx on public.series (user_id, updated_at desc);

-- Tabla de partes de serie (relaciona sermones con series)
create table if not exists public.series_parts (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series (id) on delete cascade,
  sermon_id uuid references public.sermons (id) on delete set null,
  part_number int not null,
  title text not null,
  scripture text default '',
  scheduled_date date,
  delivered_date date,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(series_id, part_number)
);

create index if not exists series_parts_series_idx on public.series_parts (series_id, part_number);
create index if not exists series_parts_sermon_idx on public.series_parts (sermon_id);

-- Tabla de eventos del planificador
create table if not exists public.schedule_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  event_date date not null,
  type text not null default 'sermon', -- sermon, devocional, clase, otro
  description text default '',
  scripture text default '',
  series_id uuid references public.series (id) on delete set null,
  sermon_id uuid references public.sermons (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists schedule_events_user_idx on public.schedule_events (user_id, event_date);
create index if not exists schedule_events_date_idx on public.schedule_events (event_date);

-- RLS para series
alter table public.series enable row level security;
alter table public.series_parts enable row level security;
alter table public.schedule_events enable row level security;

create policy "series_own" on public.series
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "series_parts_own" on public.series_parts
  for all using (
    exists (select 1 from public.series s where s.id = series_id and s.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.series s where s.id = series_id and s.user_id = auth.uid())
  );

create policy "schedule_events_own" on public.schedule_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Función para actualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
drop trigger if exists update_series_updated_at on public.series;
create trigger update_series_updated_at
  before update on public.series
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_series_parts_updated_at on public.series_parts;
create trigger update_series_parts_updated_at
  before update on public.series_parts
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_schedule_events_updated_at on public.schedule_events;
create trigger update_schedule_events_updated_at
  before update on public.schedule_events
  for each row execute procedure update_updated_at_column();
