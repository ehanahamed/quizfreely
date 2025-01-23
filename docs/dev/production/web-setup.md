## Production setup for web

Clone `ehanahamed/quizfreely` without downloading the whole repo:
```sh
# for main branch:
git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/ehanahamed/quizfreely
# OR for dist branch:
# git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/ehanahamed/quizfreely --branch dist
```

Add the `web/` folder and then checkout:
```sh
# for web/:
cd quizfreely
git sparse-checkout add web
git checkout
# OR for web/ and api/:
# cd quizfreely
# git sparse-checkout add web api
# git checkout
```

Now you will have `quizfreely/web/` without downloading the whole source code repository.

For the production server/droplet, we usually run these commands in `/root/` (`root` user's home dir), which means we get `/root/quizfreely/web/`.

### Installing dependencies

Make sure you have nodejs v20 LTS (or higher) installed.
Make sure it exists in `/usr/bin/` (`/usr/bin/node` and `/usr/bin/npm`)
For more nodejs installation info, see [install-nodejs.md](./install-nodejs.md)

Install node modules
```sh
cd /root/quizfreely/web/
npm install
```

### Dotenv config

Copy the .env.example file:
```sh
cd /root/quizfreely/web/
cp .env.example .env
```

Now edit `.env`:
1. Set `HOST=` to `HOST=localhost`
2. Set `LOG_PRETTY=` to `LOG_PRETTY=false`
3. Check your/our quizfreely-api dotenv and then set `ENABLE_OAUTH_GOOGLE=`
4. Set `CACHE_VIEWS=` to `CACHE_VIEWS=true`

Quizfreely-web's .env file is documented with detail in [web-dotenv.md](../web/web-dotenv.md)

When you're done, the edited .env file should look similar to this:
```sh
PORT=8080

# for production: HOST=localhost
# for development (IPv6 (and IPv4 "depending on OS")): HOST="::"
# for development (IPv4): HOST=0.0.0.0
HOST=localhost

# fatal, error, warn, info, debug, or trace
LOG_LEVEL=warn

# for production: LOG_PRETTY=false
# for development: LOG_PRETTY=true
LOG_PRETTY=false

# no trailing slash: https://example.com NOT https://example.com/
# production api & web on same machine: API_URL=http://localhost:8008
# production api on different host: API_URL=https://example.com
# for development: API_URL=http://localhost:8008
API_URL=http://localhost:8008

# for production: CACHE_VIEWS=true
# for development: CACHE_VIEWS=false
CACHE_VIEWS=true

# for production: CRON_CLEAR_LOGS=true
CRON_CLEAR_LOGS=true

# croner syntax: https://croner.56k.guru/usage/pattern/
# weekly: CRON_CLEAR_LOGS_INTERVAL="0 0 * * 0"
# daily: CRON_CLEAR_LOGS_INTERVAL="0 0 * * *"
CRON_CLEAR_LOGS_INTERVAL="0 0 * * *"

# show/hide google oauth buttons/menus/etc
# also check api/.env for related oauth configuration
ENABLE_OAUTH_GOOGLE=actual_true_or_false_value
```

For more details about the .env file, see [web-dotenv.md](../web/web-dotenv.md)

### Service file

Copy the systemd service file into its correct location (usually `/etc/systemd/system/`)
```sh
cd /root/quizfreely/web/
sudo cp ./quizfreely-web.service /etc/systemd/system/
```

The systemd service file runs quizfreely-web from `/root/quizfreely/web/`. If you have `quizfreely/web/` under a different path, change the path in the `WorkingDir=` line of the systemd file.

After you create and/or edit the service file, reload systemd thingies:
```sh
sudo systemctl daemon-reload
```

To run quizfreely-web, start the systemd service
```sh
sudo systemctl start quizfreely-web
# check if quizfreely/web is running:
# systemctl status quizfreely-web
# to stop it, do:
# sudo systemctl stop quizfreely-web
```

If the systemd service is running successfully, quizfreely's website should be on port `:8080` by default.

We use Caddy to let the quizfreely-web process on port `:8080` be accessed from `quizfreely.org` with https. See [caddy-setup.md](./caddy-setup.md) to finish setting up Quizfreely's website.

## Updating

Temporarily stop quizfreely-web:
```sh
sudo systemctl stop quizfreely-web
# and if it's running, stop quizfreely-api:
# sudo systemctl stop quizfreely-api
```

Pull changes with git:
```sh
cd /root/quizfreely/web
git pull
# if there are changes to .env.example
# see web-setup.md > Dotenv config, and run:
# cp .env.example .env

# if there are changes to quizfreely-web.service:
# see web-setup.md > Service file, and run:
# cp quizfreely-web.service /etc/systemd/system/
```

Check `web/quizfreely-web.log`, and delete/clear it if needed. (a new `quizfreely-web.log` will be created when the server starts if you/we delete the whole file)

After all changes are made, start quizfreely-web again:
```sh
sudo systemctl start quizfreely-web
# if there were any changes to caddy,
# see developer docs > production > caddy-setup.md
# and when you're/we're done run:
# sudo systemctl reload caddy
```
