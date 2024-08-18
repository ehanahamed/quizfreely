## Server setup

Clone without downloading the whole repo:
```sh
git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/ehanahamed/quizfreely
# or, for dist branch:
# git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/ehanahamed/quizfreely --branch dist
```

Then, get just the web folder:
```sh
cd quizfreely
git sparse-checkout add web
git checkout
```

Now you will have `quizfreely/web/`
```sh
cd web
```

make sure you have nodejs v20 lts (or higher) installed,
and make sure it can be accessed from `/usr/bin/` (`/usr/bin/node` and `/usr/bin/npm`)

install node modules
```sh
npm install
```

Now copy the example .env file:
```sh
cp .env.example .env
```

Now edit the .env file and make sure everything is correct, there are comments inside it for everything.

Now, copy the systemd service file into its correct location (usually `/etc/systemd/system/`)
```sh
cp quizfreely-web.service /etc/systemd/system/
```

The systemd service file assumes you cloned quizfreely/web into `/root/quizfreely/web`. If you cloned it into a different path, change the path in the `ExecStart` line of the systemd file you just copied.

Reload systemd thingies
```sh
systemctl daemon-reload
```

Start the systemd service
```sh
systemctl start quizfreely-web
```

### Checking & managing the service
In case you don't know how to use systemctl, useful commands are listed here:

```sh
# start the service
systemctl start quizfreely-web
# check if it's running or if there's errors
systemctl status quizfreely-web
# stop the service
systemctl stop quizfreely-web
```

We **usually** don't need to enable or disable the service, we just start or stop it.
