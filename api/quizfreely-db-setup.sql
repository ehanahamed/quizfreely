create extension if not exists pgcrypto;

/* the server process/api's js code connects to the database as quizfreely_api
we can log in/connect as quizfreely_api using the password we set
we can NOT log in to quizfreely_auth or quizfreely_auth_user
we must switch to/become those users after logging in/connecting as quizfreely_api */
create role quizfreely_api noinherit login;
create role quizfreely_auth nologin noinherit;
create role quizfreely_auth_user nologin noinherit;

/* let quizfreely_api become quizfreely_auth */
grant quizfreely_auth to quizfreely_api;
/* let quizfreely_auth become quizfreely_auth_user
quizfreely_api has to become quizfreely_auth before becoming quizfreely_auth_user */
grant quizfreely_auth_user to quizfreely_auth;

create schema auth;

grant usage on schema auth to quizfreely_api, quizfreely_auth, quizfreely_auth_user;

create function auth.get_user_id() returns uuid
as $$ select current_setting('quizfreely_auth.user_id')::uuid $$
language sql;

create table auth.users (
  id uuid primary key default gen_random_uuid(),
  username text,
  encrypted_password text,
  display_name text not null,
  auth_type text not null default 'username-password',
  oauth_google_id text,
  oauth_google_email text,
  unique (username),
  unique (oauth_google_id)
);

grant select on auth.users to quizfreely_auth;
grant insert on auth.users to quizfreely_auth;
grant update on auth.users to quizfreely_auth, quizfreely_auth_user;
grant delete on auth.users to quizfreely_auth, quizfreely_auth_user;

alter table auth.users enable row level security;

create policy select_users_for_quizfreely_auth on auth.users
as permissive
for select
to quizfreely_auth
using (true);

create policy insert_users_for_quizfreely_auth on auth.users
as permissive
for insert
to quizfreely_auth
with check (true);

create policy update_users_for_quizfreely_auth on auth.users
as permissive
for update
to quizfreely_auth
using (true)
with check (true);

create policy update_users_for_auth_user_by_user_id on auth.users
as permissive
for update
to quizfreely_auth_user
using ((select auth.get_user_id()) = id)
with check ((select auth.get_user_id()) = id);

create policy delete_users_for_auth_user_by_user_id on auth.users
as permissive
for delete
to quizfreely_auth_user
using ((select auth.get_user_id()) = id);

create view public.profiles as select
id, username, display_name from auth.users;

grant select on public.profiles to quizfreely_api, quizfreely_auth, quizfreely_auth_user;

create table auth.sessions (
  id uuid primary key default gen_random_uuid(),
  token text not null default encode(gen_random_bytes(32), 'base64'),
  user_id uuid not null,
  expire_at timestamptz default clock_timestamp() + '5 days'::interval
);

grant select on auth.sessions to quizfreely_auth, quizfreely_auth_user;
grant insert on auth.sessions to quizfreely_auth, quizfreely_auth_user;
grant update on auth.sessions to quizfreely_auth, quizfreely_auth_user;
grant delete on auth.sessions to quizfreely_api, quizfreely_auth, quizfreely_auth_user;

alter table auth.sessions enable row level security;

create policy select_sessions_for_quizfreely_auth on auth.sessions
as permissive
for select
to quizfreely_auth
using (true);

create policy insert_sessions_for_quizfreely_auth on auth.sessions
as permissive
for insert
to quizfreely_auth
with check (true);

create policy update_sessions_for_quizfreely_auth on auth.sessions
as permissive
for update
to quizfreely_auth
using (true)
with check (true);

create policy select_sessions_for_auth_user_by_user_id on auth.sessions
as permissive
for select
to quizfreely_auth_user
using ((select auth.get_user_id()) = user_id);

create policy insert_sessions_for_auth_user_by_user_id on auth.sessions
as permissive
for insert
to quizfreely_auth_user
with check ((select auth.get_user_id()) = user_id);

create policy delete_sessions_for_auth_user_by_user_id on auth.sessions
as permissive
for delete
to quizfreely_auth_user
using ((select auth.get_user_id()) = user_id);

create policy delete_expired_sessions on auth.sessions
as permissive
for delete
to quizfreely_api, quizfreely_auth, quizfreely_auth_user
using (expire_at < clock_timestamp());

create function auth.verify_and_refresh_session(session_id uuid, session_token text)
returns table(id uuid, token text, user_id uuid)
as $$ update auth.sessions
set token = encode(gen_random_bytes(32), 'base64'),
expire_at = clock_timestamp() + '5 days'::interval
where id = $1 and token = $2
returning id, token, user_id $$
language sql;

create table public.studysets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text not null,
  private boolean not null,
  data jsonb not null,
  updated_at timestamptz default clock_timestamp(),
  terms_count int,
  featured boolean default false,
  tsvector_title tsvector generated always as (to_tsvector('english', title)) stored
);

create index textsearch_title_idx on public.studysets using GIN (tsvector_title);

grant select on public.studysets to quizfreely_api, quizfreely_auth, quizfreely_auth_user;
grant insert on public.studysets to quizfreely_auth_user;
grant update on public.studysets to quizfreely_auth_user;
grant delete on public.studysets to quizfreely_auth_user;

alter table public.studysets enable row level security;

create policy select_studysets_by_not_private on public.studysets
as permissive
for select
to quizfreely_api, quizfreely_auth
using (private = false);

create policy select_studysets_for_auth_user_by_private_or_user_id on
public.studysets
as permissive
for select
to quizfreely_auth_user
using (
  (private = false) or
  ((select auth.get_user_id()) = user_id)
);

create policy insert_studysets_for_auth_user_by_user_id on
public.studysets
as permissive
for insert
to quizfreely_auth_user
with check (
  (select auth.get_user_id()) = user_id
);

create policy
update_studysets_for_auth_user_by_user_id on public.studysets
as permissive
for update
to quizfreely_auth_user
using (
  (select auth.get_user_id()) = user_id
)
with check (
  (select auth.get_user_id()) = user_id
);

create policy
delete_studysets_for_auth_user_by_user_id on public.studysets
as permissive
for delete
to quizfreely_auth_user
using (
  (select auth.get_user_id()) = user_id
);
