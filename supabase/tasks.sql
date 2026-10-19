create table if not exists public.tw_tasks (
  id uuid primary key default gen_random_uuid(),
  tweek_id text unique not null,
  calendar_id text not null,
  text text not null default '',
  done boolean not null default false,
  date date,
  list_id text,
  color text,
  note text,
  checklist jsonb,
  freq int,
  recurrence text,
  dt_start date,
  iso_date text,
  recurring_todo_id text,
  is_virtual boolean not null default false,
  hash text not null,
  local jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  deleted_at timestamptz
);
create index if not exists tw_tasks_date_idx on public.tw_tasks (date) where deleted_at is null;

create table if not exists public.tw_task_events (
  id bigserial primary key,
  task_id uuid references public.tw_tasks(id) on delete set null,
  tweek_id text,
  type text not null,
  source text not null,
  changes jsonb,
  snapshot jsonb,
  at timestamptz not null default now()
);
create index if not exists tw_task_events_at_idx on public.tw_task_events (at desc);

create table if not exists public.tw_sync_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS attiva e nessuna policy: la anon key non può leggere né scrivere.
-- Si accede solo dal server con la service role key.
alter table public.tw_tasks enable row level security;
alter table public.tw_task_events enable row level security;
alter table public.tw_sync_state enable row level security;
