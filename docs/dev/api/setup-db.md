Enable postgres extensions
```sql
create extension if not exists pgcrypto;
```

Create schema for auth
```sql
create schema auth;
```

Create auth.users table
```sql
create table auth.users (
  id bigint primary key generated always as identity,
  username text,
  encrypted_password text,
  display_name text not null
);
```

Create auth.sessions table
```sql
create table auth.sessions (
  token text not null primary key default encode(gen_random_bytes(32), 'base64'),
  user_id bigint not null,
  expire_at timestamptz default clock_timestamp() + '7 days'::interval
);
```

Create public.studysets table
```sql
CREATE TABLE studysets (
  id bigint primary key generated always as identity,
  user_id bigint not null,
  title text not null,
  private boolean not null,
  data jsonb not null,
  updated_at timestamptz not null
);
```
