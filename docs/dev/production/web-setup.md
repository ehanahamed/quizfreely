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
npm install
```

### Dotenv config

Copy the .env.example file:
```sh
cp .env.example .env
```

Now edit the .env file, see 

### Service file

Copy the systemd service file into its correct location (usually `/etc/systemd/system/`)
```sh
sudo cp ./quizfreely-web.service /etc/systemd/system/
```

The systemd service file runs quizfreely-web from `/root/quizfreely/web/`. If you have `quizfreely/web/` under a different path, change the path in the `WorkingDir=` line of the systemd file.

After you create or edit the service file, reload systemd thingies:
```sh
systemctl daemon-reload
```

To run quizfreely-web, start the systemd service
```sh
systemctl start quizfreely-web
# check if quizfreely/web is running:
# systemctl status quizfreely-web
# to stop it, do:
# systemctl stop quizfreely-web
```

If the systemd service is running successfully, quizfreely's website should be on port `:8080` by default.

We use Caddy to let the quizfreely-web process on port `:8080` be accessed from `quizfreely.com` with https. See [caddy-setup.md](./caddy-setup.md) to set it up.
