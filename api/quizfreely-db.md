Install postgres, then switch to the `postgres` linux user:
```sh
sudo su postgres
```

While being the `postgres` linux user, initalize the database cluster:
```sh
initdb --locale=C.UTF-8 --encoding=UTF8 -D /var/lib/postgres/data
```

Go back to your normal linux user (open a new terminal or use the `exit` command) and start `postgresql.service`:
```sh
sudo systemctl start postgresql.service
```

Then, while being the `postgres` linux user (`sudo su postgres`), create the database:
```sh
createdb quizfreely-db
```

Now, while still being the `postgres` linux user, access the database shell:
```sh
psql -d quizfreely-db
```

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

Temporarily switch to the `quizfreely_auth` postgres user:
```sql
set role quizfreely_auth;
```

Create auth functions, create users table, and add row level security:
```sql
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

revoke all privileges on auth.users from quizfreely_public, quizfreely_auth_user;
grant select (id, username, display_name) on auth.users to quizfreely_public, quizfreely_auth_user;

create table auth.sessions (
  id uuid primary key default gen_random_uuid(),
  token text not null default encode(gen_random_bytes(32), 'base64'),
  user_id uuid not null,
  expire_at timestamptz default clock_timestamp() + '7 days'::interval
);

alter table auth.sessions enable row level security;

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
```

Switch back to the `postgres` postgresql user:
```sql
reset role;
```

```sql
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
