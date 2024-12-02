create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create role quizfreely_api noinherit login;

create schema auth;

grant usage on schema auth to quizfreely_api;

/*create function auth.get_user_id() returns uuid
language sql
as $$
select current_setting('quizfreely_authed_user.user_id')::uuid
$$;*/

create type auth_type_enum as enum ('username_password', 'oauth_google');
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  username text,
  encrypted_password text,
  display_name text not null,
  auth_type auth_type_enum not null,
  oauth_google_id text,
  oauth_google_email text,
  unique (username),
  unique (oauth_google_id)
);

grant select on auth.users to quizfreely_api;
grant insert on auth.users to quizfreely_api;
grant update on auth.users to quizfreely_api;
grant delete on auth.users to quizfreely_api;

alter table auth.users enable row level security;

create policy select_users on auth.users
as permissive
for select
to quizfreely_api
using (
  ((select current_setting('qzfr_api.scope')) = 'auth') or (
    (select current_setting('qzfr_api.scope')) = 'user' and
    (select current_setting('qzfr_api.user_id'))::uuid = id
  )
);

create policy insert_users on auth.users
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope')) = 'auth'
);

create policy update_users on auth.users
as permissive
for update
to quizfreely_api
using (
  ((select current_setting('qzfr_api.scope')) = 'auth') or (
    (select current_setting('qzfr_api.scope')) = 'user' and
    (select current_setting('qzfr_api.user_id'))::uuid = id
  )
)
with check (true);

create policy delete_users on auth.users
as permissive
for delete
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope')) = 'auth'
);

create view public.profiles as select
id, username, display_name from auth.users;

grant select on public.profiles to quizfreely_api;

create table auth.sessions (
  token text primary key default encode(gen_random_bytes(32), 'base64'),
  user_id uuid not null,
  expire_at timestamptz default now() + '10 days'::interval
);

grant select on auth.sessions to quizfreely_api;
grant insert on auth.sessions to quizfreely_api;
grant update on auth.sessions to quizfreely_api;
grant delete on auth.sessions to quizfreely_api;

alter table auth.sessions enable row level security;

create policy select_sessions on auth.sessions
as permissive
for select
to quizfreely_api
using (
  (
    (select current_setting('qzfr_api.scope')) = 'auth'
  ) or (
    (select current_setting('qzfr_api.scope')) = 'user' and
    (select current_setting('qzfr_api.user_id'))::uuid = user_id
  )
);

create policy insert_sessions on auth.sessions
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope')) = 'auth'
);

create policy update_sessions on auth.sessions
as permissive
for update
to quizfreely_api
using (
  (
    (select current_setting('qzfr_api.scope')) = 'auth'
  ) or (
    (select current_setting('qzfr_api.scope')) = 'user' and
    (select current_setting('qzfr_api.user_id'))::uuid = user_id
  )
)
with check (true);

create policy delete_sessions on auth.sessions
as permissive
for delete
to quizfreely_api
using (
  (
    (select current_setting('qzfr_api.scope')) = 'auth'
  ) or (
    (select current_setting('qzfr_api.scope')) = 'user' and
    (select current_setting('qzfr_api.user_id'))::uuid = user_id
  ) or (
    expire_at < (select now())
  )
);

/*
  usage:
  select user_id from auth.verify_session('token goes here');
  if that returns 0 rows, session is invalid
  if that returns 1 row, session is valid, and user's id is returned user_id
*/
create function auth.verify_session(session_token text)
returns table(user_id uuid)
language sql
as $$
select user_id from auth.sessions where token = $1 and expire_at > (select now())
$$;

create procedure auth.delete_expired_sessions()
language sql
as $$
delete from auth.sessions where expire_at < (select now())
$$;

create table public.studysets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text not null,
  private boolean not null,
  data jsonb not null,
  updated_at timestamptz default now(),
  terms_count int,
  featured boolean default false,
  tsvector_title tsvector generated always as (to_tsvector('english', title)) stored
);

create index textsearch_title_idx on public.studysets using GIN (tsvector_title);

grant select on public.studysets to quizfreely_api;
grant insert on public.studysets to quizfreely_api;
grant update on public.studysets to quizfreely_api;
grant delete on public.studysets to quizfreely_api;

alter table public.studysets enable row level security;

create policy select_studysets on public.studysets
as permissive
for select
to quizfreely_api
using (
  (private = false) or (
    (select current_setting('qzfr_api.scope')) = 'user' and
    (select current_setting('qzfr_api.user_id'))::uuid = user_id
  )
);

create policy insert_studysets on
public.studysets
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope')) = 'user' and
  (select current_setting('qzfr_api.user_id'))::uuid = user_id
);

create policy update_studysets on public.studysets
as permissive
for update
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope')) = 'user' and
  (select current_setting('qzfr_api.user_id'))::uuid = user_id
)
with check (true);

create policy delete_studysets on public.studysets
as permissive
for delete
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope')) = 'user' and
  (select current_setting('qzfr_api.user_id'))::uuid = user_id
);

create type score_type_enum as enum ('review_mode', 'quiz');

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  studyset_id uuid references public.studysets (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  correct int not null,
  incorrect int not null,
  score_type score_type_enum not null,
  data jsonb not null,
  updated_at timestamptz default now()
);

grant select on public.scores to quizfreely_api;
grant insert on public.scores to quizfreely_api;
grant delete on public.scores to quizfreely_api;

alter table public.scores enable row level security;

create policy select_scores on public.scores
as permissive
for select
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope')) = 'user' and
  (select current_setting('qzfr_api.user_id'))::uuid = user_id
);

create policy insert_scores on
public.scores
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope')) = 'user' and
  (select current_setting('qzfr_api.user_id'))::uuid = user_id
);

create policy delete_scores on public.scores
as permissive
for delete
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope')) = 'user' and
  (select current_setting('qzfr_api.user_id'))::uuid = user_id
);

create table public.search_queries (
  query text primary key,
  subject text
);

grant select on public.search_queries to quizfreely_api;
alter table public.search_queries disable row level security;
