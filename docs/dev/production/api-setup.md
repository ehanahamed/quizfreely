## Production setup for api

You should probably create a user first, for our production server we made an unprivileged user, `quizfreely`, to run the server processes, with a home dir/folder at `/home/quizfreely/`: (our systemd service/unit which we configure later will use this user)
```bash
sudo useradd -m -s /bin/bash quizfreely
```

Clone `ehanahamed/quizfreely` from Codeberg or GitHub, if you haven't already:
```sh
sudo su quizfreely
cd ~
git clone https://codeberg.org/ehanahamed/quizfreely.git
```

For our production server/droplet, we clone it inside `/home/quizfreely/` which means we get `/home/quizfreely/quizfreely/api/`, so we can have a seperate user with different permissions for our systemd unit/service that we configure later.

Make sure to like clone, copy, edit, run commands, and everything throughout this like doc after doing `su quizfreely` so you do it as the correct user and stuff. Some commands need you to `exit` back to a different user that can use `sudo`, when it's like mentioned.

### Installing dependencies

Make sure you have nodejs v20 LTS (or higher) installed.
Make sure it exists in `/usr/bin/` (`/usr/bin/node` and `/usr/bin/npm`)
For more nodejs installation info, see [install-nodejs.md](./install-nodejs.md)

Install node modules
```sh
cd ~/quizfreely/api/
npm install
```

### Postgres setup

Install PostgreSQL from your/our package manager
```sh
sudo apt install postgresql
# or
# sudo pacman -S postgresql
```

Check if `postgresql.service` is running
```sh
exit
sudo systemctl status postgresql.service
# if it's not running, run:
# sudo systemctl start postgresql.service

# if `systemctl start...` says "postgresql.service failed because the control process exited with error code.", run `systemctl status...` (again) to see the error:
# sudo systemctl status postgresql.service

# if `systemctl status...` says `"/var/lib/postgres/data" is missing or empty.`, then run:
# sudo su postgres
# cd ~
# initdb --locale=C.UTF-8 --encoding=UTF8 -D /var/lib/postgres/data
# exit
# sudo systemctl start postgresql.service
```

Then switch to the `postgres` linux user (do it again, if you already did)
```sh
exit
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

Set a secure password for the `postgres` user:
```sh
\password postgres
```

Run the commands in [quizfreely/config/db/quizfreely-db-setup.sql](../../../config/db/quizfreely-db-setup.sql) to setup all the users, schemas, tables, & functions. You can just copy and paste all the commands from the file into the database shell.

We used sparse-checkout to clone the repository, so you will NOT find `config/` on your/our cloned copy. Only `api/` (and/or `web/`) will exist on your/our cloned copy. You can get `quizfreely-db-setup.sql` from Quizfreely's Codeberg/GitHub.

After you run those commands, there will be a user named `quizfreely_api`. We need to set its password:
```sh
\password quizfreely_api
```

We will use this password in `POSTGRES_URI=` in the `.env` file that we will configure next. (The api server process/js code connects to the database as this `quizfreely_api` postgres user)

Now that all the tables, functions, etc are set up, we can add some data. `quizfreely/config/db/search-queries.sql` has phrases/queries for autocomplete/search predictions, you/we should run the commands in that file (you can just copy and paste).

Now, when you're done with SQL commands, exit the database shell:
```sh
\q
```

And stop being the `postgres` linux user:
```sh
exit
```

### Dotenv config

Copy the .env.example file:
```sh
sudo su quizfreely
cd ~/quizfreely/api/
cp .env.example .env
```

Now edit `.env`:
1. Set `HOST=` to `HOST=localhost`
2. Replace `PASSWORD_GOES_HERE` with your/our password for the "quizfreely_api" postgres user in `POSTGRES_URI=`
3. Set `CORS_ORIGIN=` to `CORS_ORIGIN=https://quizfreely.org`
4. Set `LOG_PRETTY=` to `LOG_PRETTY=false`
5. Get/find our client ID & secret for Google OAuth from Google Cloud Console Thingy, add them in `OAUTH_GOOGLE_CLIENT_ID=` and `OAUTH_GOOGLE_CLIENT_SECRET=`
6. Set `ENABLE_OAUTH_GOOGLE=` to `ENABLE_OAUTH_GOOGLE=true`, also check quizfreely-web's dotenv file
7. Set `OAUTH_GOOGLE_CALLBACK_URI=` to `OAUTH_GOOGLE_CALLBACK_URI=https://quizfreely.org/api/oauth/google/callback`
8. Set `OAUTH_REDIRECT_URL=` to `OAUTH_REDIRECT_URL=https://quizfreely.org/sign-in`

All details and options for quizfreely-api's .env file are documented in [api-dotenv.md](../api/api-dotenv.md)

When you're done, the edited .env file should look similar to this:
```sh
PORT=8008

# for production: HOST=localhost
# for development (IPv6 (and IPv4 "depending on OS")): HOST="::"
# for development (IPv4): HOST=0.0.0.0
HOST=localhost

# fatal, error, warn, info, debug, or trace
LOG_LEVEL=warn

# for production: LOG_PRETTY=false
# for development: LOG_PRETTY=true
LOG_PRETTY=true

# replace PASSWORD_GOES_HERE and check database name
POSTGRES_URI=postgres://quizfreely_api:ACTUAL_PASSWORD@localhost/quizfreely_db

# for production: CORS_ORIGIN=https://quizfreely.org
# for development: CORS_ORIGIN=http://localhost:8080
CORS_ORIGIN=https://quizfreely.org

# enable or disable Google OAuth
# when true, OAUTH_GOOGLE_CLIENT_ID and OAUTH_GOOGLE_CLIENT_SECRET must be set
ENABLE_OAUTH_GOOGLE=true

OAUTH_GOOGLE_CLIENT_ID=ACTUAL_ID_GOES_HERE
OAUTH_GOOGLE_CLIENT_SECRET=ACTUAL_SECRET_GOES_HERE

# production: OAUTH_GOOGLE_CALLBACK_URI=https://quizfreely.org/api/oauth/google/callback
# development: OAUTH_GOOGLE_CALLBACK_URI=http://localhost:8080/api/oauth/google/callback
OAUTH_GOOGLE_CALLBACK_URI=https://quizfreely.org/api/oauth/google/callback

# production: OAUTH_REDIRECT_URL=https://quizfreely.org/sign-in
# development: OAUTH_REDIRECT_URL=http://localhost:8080/sign-in
OAUTH_REDIRECT_URL=https://quizfreely.org/sign-in
```

For more details about quizfreely-api's .env file, see [api-dotenv.md](../api/api-dotenv.md)

### Service file

Copy the systemd service file into its correct location (usually `/etc/systemd/system/`)
```sh
exit # back to a user that can sudo, we don't want to give user `quizfreely` sudo permission for security or something
cd /home/quizfreely/quizfreely/
sudo cp config/quizfreely-api.service /etc/systemd/system/
```

The systemd service file runs quizfreely-api from `/home/quizfreely/quizfreely/api/`. If you have `quizfreely/api/` under a different path, change the path in the `WorkingDir=` line of the systemd file.

After you create and/or edit the service file, reload systemd thingies:
```sh
sudo systemctl daemon-reload
```

To run quizfreely-api, start the systemd service
```sh
sudo systemctl start quizfreely-api
# check if quizfreely/api is running:
# systemctl status quizfreely-api
# to stop it, do:
# sudo systemctl stop quizfreely-api
```

If the systemd service is running successfully, quizfreely-api should be on port `:8008` by default.

We use Caddy to let quizfreely-web's process on port `:8080` be accessed from `quizfreely.org`, and quizfreely-web proxies quizfreely-api's process on port `:8008` to be accessed from `quizfreely.org/api` with https and stuff. See [caddy-setup.md](./caddy-setup.md) to finish setting up quizfreely-api and quizfreely-web.

For instructions to manage & backup the database see [db.md](./db.md)

## Updating

Temporarily stop quizfreely-api:
```sh
sudo systemctl status quizfreely-api
# and if it's running, stop quizfreely-web:
# sudo systemctl stop quizfreely-web
```

Pull changes with git:
```sh
cd ~/quizfreely/api
git pull
# if there are changes to .env.example
# check api-setup.md > Dotenv config, and run:
# cp .env.example .env

# if there are changes to quizfreely-api.service:
# check api-setup.md > Service file, and run:
# cp config/quizfreely-api.service /etc/systemd/system/
```

Check `api/quizfreely-api.log`, and delete/clear it if needed. (a new `quizfreely-api.log` will be created when the server process starts if you/we delete the whole file)

If there are changes to [config/db/quizfreely-db-setup.sql](../../../config/db/quizfreely-db-setup.sql), we will manually update the production database to match all the changes to roles, schemas, tables, or functions in `quizfreely-db-setup.sql`.

Also make sure to keep `public.search_queries` and `quizfreely/config/db/search-queries.sql` up to date.

After all changes are made, start quizfreely-api again:
```sh
sudo systemctl start quizfreely-api
# if there were any changes to caddy,
# check developer docs > production > caddy-setup.md
# and when you're/we're done run:
# sudo systemctl reload caddy
```
