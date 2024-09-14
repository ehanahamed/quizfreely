# Database Production Documentation

We use PostgreSQL cause it's open source and reliable. This page explains how to backup the database and stuff.

To set up the database (and api) for production see [api-setup.md](./api-setup.md)

## Backups

We can use `pg_dump` to back up the whole entire database. (user content, account/auth data, everything)
```sh
sudo su postgres
pg_dump quizfreely-db > quizfreely-db-backup.sql
```

To restore the backed up data into a freshly created database, use the sql file:
```sh
sudo su postgres
psql -d quizfreely-db -f quizfreely-db-backup.sql
```
