Install postgres
```sh
sudo apt install postgresql
# or
# sudo pacman -S postgresql
```

Check if `postgresql.service` is running
```sh
sudo systemctl status postgresql.service
# if it's not, run:
# sudo systemctl start postgresql.service
```

Then switch to the `postgres` linux user:
```sh
sudo su postgres
```

Now create the database:
```sh
createdb quizfreely-db
```

Now, while still being the `postgres` linux user, access the database shell:
```sh
psql -d quizfreely-db
```

You should be using the postgresql database shell as the `postgres` postgressql user. The roles we create below are for the api, we will not log in to them here.

Install extensions and create roles:
```sql
create extension if not exists pgcrypto;

create role quizfreely_auth noinherit login;
create role quizfreely_public nologin noinherit;
create role quizfreely_auth_user nologin noinherit;

grant quizfreely_public, quizfreely_auth_user to quizfreely_auth;
```

Then, set `quizfreely_auth`'s password with `psql` meta command, the other users are `nologin`, so they don't have a password, only `quizfreely_auth` does:
```sql
\password quizfreely_auth
```

Also set the `postgres` sql user's password with `psql`:
```sql
\password postgres
```

Create auth functions, create users table, and add row level security:
```sql
create schema auth;

grant usage on schema auth to quizfreely_auth, quizfreely_public, quizfreely_auth_user;

create function auth.get_user_id() returns uuid
as $$ select current_setting('quizfreely_auth_user_id')::uuid $$
language sql;

create table auth.users (
  id uuid primary key default gen_random_uuid(),
  username text,
  encrypted_password text,
  display_name text not null,
  unique (username)
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

grant select on public.profiles to quizfreely_public, quizfreely_auth_user;

create table auth.sessions (
  id uuid primary key default gen_random_uuid(),
  token text not null default encode(gen_random_bytes(32), 'base64'),
  user_id uuid not null,
  expire_at timestamptz default clock_timestamp() + '5 days'::interval
);

grant select on auth.sessions to quizfreely_auth, quizfreely_auth_user;
grant insert on auth.sessions to quizfreely_auth, quizfreely_auth_user;
grant update on auth.sessions to quizfreely_auth, quizfreely_auth_user;
grant delete on auth.sessions to quizfreely_auth, quizfreely_auth_user, quizfreely_public;

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
to quizfreely_auth, quizfreely_public, quizfreely_auth_user
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
  user_id uuid not null,
  title text not null,
  private boolean not null,
  data jsonb not null,
  updated_at timestamptz default clock_timestamp()
);

alter table public.studysets enable row level security;

create policy select_studysets_for_quizfreely_public_by_private on public.studysets
as permissive
for select
to quizfreely_public
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
```
