## Production setup for web

You should probably create a user first. For our production server we made an unprivileged user, `quizfreely`, to run the server processes, with a home dir/folder at `/home/quizfreely/`: (our systemd service/unit which we configure later will use this user)
```bash
sudo useradd -m -s /bin/bash quizfreely
```

Clone `quizfreely/quizfreely` from Codeberg or GitHub, if you haven't already:
```sh
sudo su quizfreely
cd ~
git clone https://codeberg.org/quizfreely/quizfreely.git
```

For our production server/droplet, we clone it inside `/home/quizfreely/` which means we get `/home/quizfreely/quizfreely/web/`, so we can have a seperate user with different permissions for our systemd unit/service that we configure later.

Make sure to like clone, copy, edit, run commands, and everything throughout this like doc after doing `su quizfreely` so you do it as the correct user and stuff. Some commands need you to `exit` back to a different user that can use `sudo`, when it's like mentioned.

### Install Dependencies & Bulid

Make sure you have nodejs v20 LTS (or higher) installed.
Make sure it exists in `/usr/bin/` (`/usr/bin/node` and `/usr/bin/npm`)
For more nodejs installation info, see [install-nodejs.md](./install-nodejs.md)

Install node modules
```sh
cd ~/quizfreely/web/
npm install
```

Now generate/compile our build:
```bash
npm run build
```

### Dotenv config

Copy the .env.example file:
```sh
cd ~/quizfreely/web/
cp .env.example .env
```

Now edit `.env`:
1. Set `HOST=` to `HOST=127.0.0.1`
2. Check your/our quizfreely-api dotenv and then set `ENABLE_OAUTH_GOOGLE=`

Quizfreely-web's .env file is documented with detail in [web-dotenv.md](../web/web-dotenv.md)

When you're done, the edited .env file should look similar to this:
```sh
HOST=127.0.0.1
PORT=8080

# no trailing slash: https://example.com NOT https://example.com/
# production api & web on same machine: API_URL=http://localhost:8008
# production api on different host: API_URL=https://example.com
# for development: API_URL=http://localhost:8008
API_URL=http://localhost:8008

# show/hide google oauth buttons/menus/etc
# also check api/.env for related oauth configuration
ENABLE_OAUTH_GOOGLE=actual_true_or_false_value
```

For more details about the .env file, see [web-dotenv.md](../web/web-dotenv.md)

### Service file

Copy the systemd service file into its correct location (usually `/etc/systemd/system/`)
```sh
exit # back to user with sudo permissions
cd /home/quizfreely/quizfreely/
sudo cp config/quizfreely-web.service /etc/systemd/system/
```

The systemd service file runs quizfreely-web from `/home/quizfreely/quizfreely/web/`. If you have `quizfreely/web/` under a different path, change the path in the `WorkingDir=` line of the systemd file.

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
sudo systemctl status quizfreely-web
# and if it's running, stop quizfreely-api:
# sudo systemctl stop quizfreely-api
```

Pull changes with git:
```sh
sudo su quizfreely
cd ~/quizfreely/
git pull
# if there are changes to web/.env.example
# check web-setup.md > Dotenv config, and run:
# cp .env.example .env

# if there are changes to config/quizfreely-web.service:
# check web-setup.md > Service file, and run:
# cp config/quizfreely-web.service /etc/systemd/system/
```

Build/compile it:
```sh
cd ~/quizfreely/web/
npm run build
```

After all changes are made, start quizfreely-web again:
```sh
exit # back to user with sudo permissions
sudo systemctl start quizfreely-web
# if there were any changes to caddy,
# check developer docs > production > caddy-setup.md
# and when you're/we're done run:
# sudo systemctl reload caddy
```
