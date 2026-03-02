-- Core schema for Nova LaunchKit
create table if not exists profiles (
  id uuid primary key,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider text not null default 'creem',
  provider_subscription_id text,
  plan_key text not null default 'free',
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists credit_accounts (
  user_id uuid primary key,
  balance integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  delta integer not null,
  reason text not null,
  request_id text,
  created_at timestamptz default now()
);

create table if not exists offer_copy_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  input jsonb not null,
  output jsonb not null,
  created_at timestamptz default now()
);

create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'creem',
  event_id text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz default now(),
  unique(provider, event_id)
);
