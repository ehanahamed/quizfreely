# Quizfreely's Backend

We use pocketbase. It's self-hosted

## Setup

The below instructions are for setting up quizfreely's "real" pocketbase instance.

As of right now we use digitalocean.

### Droplet Setup

First, create a "droplet", with:

- shared cpu > basic > regular + disk type: ssd
  - 1GB/1cpu or 2GB/1cpu
  - 25GB SSD Disk or 50GB SSD Disk
  - 1000GB transfer or 2TB transfer
- any linux distro
  - with hostname "quizfreelybackend"

With all those settings it should be around 6 USD to 12 USD per month

### DNS Setup

quizfreely.com should use digitalocean's nameservers, and Quizfreely's domain and subdomains should be set in digitalocean, under "networking" > "domains".

btw, its "home" > "networking" > "domains", NOT "home" > "droplet" > "networking",

To setup the backend's url, `api.quizfreely.com`, just add an A record, with:

- hostname: `api` (`api.quizfreely.com`)
- "directs to"/value: dropdown/"select resource" > droplet-name-goes-here/"quizfreelybackend"

That's all!

Later, when we run pocketbase, it will automatically set up a ssl certificate and everything will "just work"!

### Download Pocketbase

In the droplet, create `/root/pb/`

We're going to download pocketbase's linux executable, and move it to `/root/pb/pocketbase`. (explained in detail below)

We can find the latest download url/link in [pocketbase's github relases](https://github.com/pocketbase/pocketbase/releases) or somewhere in [pocketbase's website](https://pocketbase.io) or docs. The version in the url/link below is just an example

Use curl to download it in the droplet, for example:

```
# cd /root
# curl https://github.com/pocketbase/pocketbase/releases/download/v1234/pocketbase_1234_linux_amd64.zip -L -o /root/pocketbase.zip
```

The `-L` and `-o pocketbase.zip` options above are important.

Extract it using `unzip`

```
# apt install unzip
# unzip /root/pocketbase.zip -d /root/pocketbasezip
```

Now, we will have a folder named `pocketbasezip`, which has the contents of the zip file!

Delete the zip file (we don't need it anymore), move `/root/pocketbasezip/pocketbase` to `/root/pb/pocketbase`, and then delete `/root/pocketbasezip/` and its contents.

```
# rm /root/pocketbase.zip
# mv /root/pocketbasezip/pocketbase /root/pb/pocketbase
# rm -r /root/pocketbasezip/
```

Now we are left with pocketbase's executable, at `/root/pb/pocketbase`

### Pocketbase System Service

Under `/etc/systemd/system/`, create `/etc/systemd/system/pocketbase.service`.

Then copy `backend/etc/systemd/system/pocketbase.serivce` from Quizfreely's source code. (Copy the entire file's contents)

Edit `/etc/systemd/system/pocketbase.service` on the droplet, using `vi`

```
# vi /etc/systemd/system/pocketbase.service
```

Paste the contents from our clipboard.

`control v` might not work, so instead:

- try `control shift v`
- or use our browsers right-click menu. (It should paste multi-line selections properly)

Save the file, and then enable the service.

```
# systemctl enable pocketbase.service
```

Finally, start pocketbase!

```
# systemctl start pocketbase
```

### Importing configuration

After the backend is setup and running, open the admin ui.

The url is `/_/` (in this case `api.quizfreely.com/_/`)

Under settings, there are "import collections" and "export collections" options.

Our collections configuration is saved in our source code, at `backend/collections.json`

## Debugging & Errors

First, get info from systemctl

```
# systemctl status pocketbase
```

If everything looks fine there, stop the process from systemctl, and try running pocketbase "manually"

```
systemctl stop pocketbase
# /root/pb/pocketbase serve --http="api.quizfreely.com:80" --https="api.quizfreely.com:443"
```

### Exec format error

If you get an error that says something like `cannot execute binary file: exec format error`, that means you might have downloaded the wrong executable archetecture ("arm64" looks a lot like "amd64", you might have copied the wrong link) or mabye the zip file something-ed, either way, just try redownloading the executable.

### Error cannot assign requested address

If you see an error that says `listen tcp... bind: cannot assign requested address` or something similar, stop the process and wait a few minutes for DNS changes to work.

All I did was stop and start the process a few times waiting a total of about 5 minutes, and after running the same exact command a few times it just "started working".

This happens if DNS changes and other networking stuff didn't take effect yet.

### Privacy error or certificate not valid

If pocketbase is running fine, but trying to go to the admin ui says "privacy error", "connection is not private", "not secure", or "certificate is invalid", wait 5 to 10 minutes, and check again.

It takes a small bit of time for the certificate to fully take effect.

We don't have to manually "fix" the certificate, pocketbase automatically issues one!

Also, try fully killing your browser or even restart your device. Sometimes your browser doesn't actually refresh the page if it said it's "not secure" before.

## Controlling the process

Useful commands are listed below, they're self explanitory

```
# systemctl status pocketbase
# systemctl start pocketbase
# systemctl stop pocketbase
```
