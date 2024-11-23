# Quizfreely API

Quizfreely's API connects to Quizfreely's PostgreSQL database to store our data.

The actual api server process is written in JavaScript with NodeJS. It uses Fastify and node-postgres (`pg`).

To set up quizfreely-api (and database) for production see [developer docs > production > api-setup.md](../production/api-setup.md)

## Local Quizfreely API setup

Clone Quizfreely's source code repo (if you didn't already)
```sh
git clone https://github.com/ehanahamed/quizfreely
# or, from codeberg:
# git clone https://codeberg.org/ehanahamed/quizfreely
```

### Postgres

You need PostgreSQL (v15 or above) installed.

Check if `postgresql.service` is running
```sh
sudo systemctl status postgresql.service
# if it's not running, start it:
# sudo systemctl start postgresql.service
```

Switch to the `postgres` linux user (and go to its home dir)
```sh
sudo su postgres
cd ~
```

Now create the database:
```sh
createdb quizfreely_db
```

Now, while still being the `postgres` linux user, access the database shell:
```sh
psql -d quizfreely_db
```

Now, you should be in a different looking shell. This is the database shell, it's where you run SQL commands and stuff.

Run the commands in [quizfreely/config/db/quizfreely-db-setup.sql](../../../config/db/quizfreely-db-setup.sql) to setup all the users, schemas, tables, & functions. You can just copy and paste all the commands from the file into the database shell.

After you run those commands, there will be a postgres user named `quizfreely_api`. We need to set its password:
```sh
\password quizfreely_api
```

We will use this password in `POSTGRES_URI=` in the `.env` file that we will configure next. (The api server process/js code connects to the database as the `quizfreely_api` user. See [api > auth.md > Postgres roles](./auth.md#postgresql-roles) for more details.)

`quizfreely/config/db/search-queries.sql` has a list of autocomplete/search prediction phrases/queries. These are "optional", we need them for autocomplete, but quizfreely will run perfectly fune without them. If you want them, you can just copy and paste the whole file into psql (the database's shell).

Now, when you're done with SQL commands, exit the database shell:
```sh
\q
```

And stop being the `postgres` linux user:
```sh
exit
```

### Dotenv file

Copy the .env.example file:
```sh
cd quizfreely/api/
cp .env.example .env
```

Edit `.env` and replace `PASSWORD` with your/our password for the "quizfreely_api" postgres user in `POSTGRES_URI=postgres://quizfreely_api:PASSWORD@localhost/quizfreely_db`

All the other values are already set up with reasonable defaults for local development.

See [developer docs > api > api-dotenv.md](./api-dotenv.md) for all `.env` options & more info.

### Install dependencies & start API

You need NodeJS (v20 or above) installed.

Now, go to `api/` and install nodejs dependencies.
```sh
cd quizfreely/api/
npm install
```

Now, start quizfreely-api's server process:
```sh
npm run start
```

quizfreely-api runs on http://localhost:8008 by default. You can change this in `.env`

See [developer docs > web](../web/README.md) to set up quizfreely-web.
