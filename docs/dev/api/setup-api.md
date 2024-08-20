Create schema for auth
```
create schema auth;
```

Create users table (auth schema)
```sql
create table auth.users (
  id bigint primary key generated always as identity,
  username text,
  encrypted_password text,
  display_name text not null
);
```

Create studysets table (public schema)
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
