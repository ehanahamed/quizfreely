create extension if not exists pgcrypto;

create schema auth;

create table auth.users (
  id bigint primary key generated always as identity,
  username text,
  encrypted_password text,
  display_name text not null,
  unique (username)
);

create table auth.sessions (
  token text not null primary key default encode(gen_random_bytes(32), 'base64'),
  user_id bigint not null,
  expire_at timestamptz default clock_timestamp() + '7 days'::interval
);

create table public.studysets (
  id bigint primary key generated always as identity,
  user_id bigint not null,
  title text not null,
  private boolean not null,
  data jsonb not null,
  updated_at timestamptz default clock_timestamp()
);
