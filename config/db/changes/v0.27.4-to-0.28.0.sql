create table public.studyset_progress (
  id uuid primary key default gen_random_uuid(),
  studyset_id uuid references public.studysets (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  terms jsonb not null,
  updated_at timestamptz default now()
);

grant select on public.studyset_progress to quizfreely_api;
grant insert on public.studyset_progress to quizfreely_api;
grant update on public.studyset_progress to quizfreely_api;
grant delete on public.studyset_progress to quizfreely_api;

alter table public.studyset_progress enable row level security;

create policy select_studyset_progress on public.studyset_progress
as permissive
for select
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
);

create policy insert_studyset_progress on public.studyset_progress
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
);

create policy update_studyset_progress on public.studyset_progress
as permissive
for update
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
)
with check (true);

create policy delete_studyset_progress on public.studyset_progress
as permissive
for delete
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
);

drop policy select_users on auth.users;
drop policy insert_users on auth.users;
drop policy update_users on auth.users;
drop policy delete_users on auth.users;
drop policy select_sessions on auth.sessions;
drop policy insert_sessions on auth.sessions;
drop policy update_sessions on auth.sessions;
drop policy delete_sessions on auth.sessions;
drop policy select_studysets on public.studysets;
drop policy insert_studysets on public.studysets;
drop policy update_studysets on public.studysets;
drop policy delete_studysets on public.studysets;
drop policy select_studyset_progress on public.studyset_progress;
drop policy insert_studyset_progress on public.studyset_progress;
drop policy update_studyset_progress on public.studyset_progress;
drop policy delete_studyset_progress on public.studyset_progress;

create policy select_users on auth.users
as permissive
for select
to quizfreely_api
using (
  ((select current_setting('qzfr_api.scope', true)) = 'auth') or (
    (select current_setting('qzfr_api.scope', true)) = 'user' and
    (select current_setting('qzfr_api.user_id', true))::uuid = id
  )
);

create policy insert_users on auth.users
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope', true)) = 'auth'
);

create policy update_users on auth.users
as permissive
for update
to quizfreely_api
using (
  ((select current_setting('qzfr_api.scope', true)) = 'auth') or (
    (select current_setting('qzfr_api.scope', true)) = 'user' and
    (select current_setting('qzfr_api.user_id', true))::uuid = id
  )
)
with check (true);

create policy delete_users on auth.users
as permissive
for delete
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'auth'
);

create policy select_sessions on auth.sessions
as permissive
for select
to quizfreely_api
using (
  (
    (select current_setting('qzfr_api.scope', true)) = 'auth'
  ) or (
    (select current_setting('qzfr_api.scope', true)) = 'user' and
    (select current_setting('qzfr_api.user_id', true))::uuid = user_id
  )
);

create policy insert_sessions on auth.sessions
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope', true)) = 'auth'
);

create policy update_sessions on auth.sessions
as permissive
for update
to quizfreely_api
using (
  (
    (select current_setting('qzfr_api.scope', true)) = 'auth'
  ) or (
    (select current_setting('qzfr_api.scope', true)) = 'user' and
    (select current_setting('qzfr_api.user_id', true))::uuid = user_id
  )
)
with check (true);

create policy delete_sessions on auth.sessions
as permissive
for delete
to quizfreely_api
using (
  (
    (select current_setting('qzfr_api.scope', true)) = 'auth'
  ) or (
    (select current_setting('qzfr_api.scope', true)) = 'user' and
    (select current_setting('qzfr_api.user_id', true))::uuid = user_id
  ) or (
    expire_at < (select now())
  )
);

create policy select_studysets on public.studysets
as permissive
for select
to quizfreely_api
using (
  (private = false) or (
    (select current_setting('qzfr_api.scope', true)) = 'user' and
    (select current_setting('qzfr_api.user_id', true))::uuid = user_id
  )
);

create policy insert_studysets on public.studysets
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
);

create policy update_studysets on public.studysets
as permissive
for update
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
)
with check (true);

create policy delete_studysets on public.studysets
as permissive
for delete
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
);

create policy select_studyset_progress on public.studyset_progress
as permissive
for select
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
);

create policy insert_studyset_progress on public.studyset_progress
as permissive
for insert
to quizfreely_api
with check (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
);

create policy update_studyset_progress on public.studyset_progress
as permissive
for update
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
)
with check (true);

create policy delete_studyset_progress on public.studyset_progress
as permissive
for delete
to quizfreely_api
using (
  (select current_setting('qzfr_api.scope', true)) = 'user' and
  (select current_setting('qzfr_api.user_id', true))::uuid = user_id
);
