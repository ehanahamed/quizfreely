# Database Production Documentation

We use PostgreSQL cause it's open source and reliable. This page explains how to backup the database and stuff.

To set up the database (and api) for production see [api-setup.md](./api-setup.md)

## Backups

We can use `pg_dump` to back up the whole entire database. (user content, account/auth data, everything)
```sh
sudo su postgres
pg_dump quizfreely_old_db > quizfreely-db-backup.sql
# you could also use --data-only to copy the data without the table definitions, functions, permissions, etc
# pg_dump --data-only quizfreely_old_db > quizfreely-db-data-only.sql
```

To restore the backed up data into a freshly created database, use the sql file:
```sh
sudo su postgres
createdb quizfreely_new_db
psql -d quizfreely_new_db -f quizfreely-db-backup.sql
# if you used --data-only, then FIRST run/copy config/db/quizfreely-db-setup.sql, then run:
# psql -d quizfreely_new_db -f quizfreely-db-data-only.sql
```

pg_dump backs up all the data and all the schemas, tables, and functions, so we don't need to set those up when we restore backed up data.
