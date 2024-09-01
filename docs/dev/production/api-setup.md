## Production setup for api

Clone `ehanahamed/quizfreely` without downloading the whole repo:
```sh
# for main branch:
git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/ehanahamed/quizfreely
# OR for dist branch:
# git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/ehanahamed/quizfreely --branch dist
```

Add the `api/` folder and then checkout:
```sh
# for api/:
cd quizfreely
git sparse-checkout add api
git checkout
# OR for api/ and web/:
# cd quizfreely
# git sparse-checkout add web api
# git checkout
```

Now you will have `quizfreely/api/` without downloading the whole source code repository.

For the production server/droplet, we usually run these commands in `/root/` (`root` user's home dir), which means we get `/root/quizfreely/api/`.

### Installing dependencies

Make sure you have nodejs v20 LTS (or higher) installed.
Make sure it exists in `/usr/bin/` (`/usr/bin/node` and `/usr/bin/npm`)
For more nodejs installation info, see [install-nodejs.md](./install-nodejs.md)

Install node modules
```sh
npm install
```

### Dotenv config

Copy the .env.example file:
```sh
cp .env.example .env
```

1. Change `HOST=0.0.0.0` to `HOST=localhost`
2. Change `API_URL=http://localhost:8008` to `API_URL=https://api.quizfreely.com`
3. Replace "PASSWORD" with your/our postgres password in `POSTGRES_URI=postgres://quizfreely_auth:PASSWORD@localhost/quizfreely-db`
4. Change `CORS_ORIGIN=http://localhost:8080` to `CORS_ORIGIN=https://quizfreely.com`
5. Change `WEB_OAUTH_CALLBACK_URL=http://localhost:8080/sign-up` to `WEB_OAUTH_CALLBACK_URL=https://quizfreely.com/sign-up`

When you're done, the edited .env file should look similar to this:
```sh
PORT=8008
HOST=localhost
API_URL=https://api.quizfreely.com
POSTGRES_URI=postgres://quizfreely_auth:PASSWORD@localhost/quizfreely-db
COOKIES_DOMAIN=api.quizfreely.com
CORS_ORIGIN=https://quizfreely.com
# error, warn, info
LOG_LEVEL=warn
# OAUTH_GOOGLE_CLIENT_ID=
# OAUTH_GOOGLE_CLIENT_SECRET=
WEB_OAUTH_CALLBACK_URL=https://quizfreely.com/sign-up
```

For more details about quizfreely-api's .env file, see [api-dotenv.md](../api/api-dotenv.md)

### Service file

Copy the systemd service file into its correct location (usually `/etc/systemd/system/`)
```sh
sudo cp ./quizfreely-api.service /etc/systemd/system/
```

The systemd service file runs quizfreely-api from `/root/quizfreely/web/`. If you have `quizfreely/web/` under a different path, change the path in the `WorkingDir=` line of the systemd file.

After you create or edit the service file, reload systemd thingies:
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

We use Caddy to let the quizfreely-web process on port `:8080` be accessed from `quizfreely.com` with https. See [caddy-setup.md](./caddy-setup.md) to set it up.
