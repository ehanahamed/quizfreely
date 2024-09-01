# Installing NodeJS

## Arch Linux

Arch Linux always has recent versions of almost everything.

We need nodejs v20 LTS ("lts-iron") or higher. We can install it with `pacman`:
```
sudo pacman -S nodejs-lts-iron
```

## Debian

Debian only has older versions of packages (cause it's more stable)

We should install NodeJS v20 LTS "manually" without a package manager for our production server/droplet.

- Download NodeJS LTS v20 from their [prebuilt binaries](https://nodejs.org/en/download/prebuilt-binaries)
  - You can right click the download button/link, and then paste the download url into a curl command in the droplet's console
  - for example: `curl -O https://nodejs.org/dist/v20.17.0/node-v20.17.0-linux-x64.tar.xz`
- Extract the archive
  - `tar -xf node-v20.17.0-linux-x64.tar.xz`
- Install it by copying the folders
  - `sudo cp -r node-v20.17.0-linux-x64/{bin,include,lib,share} /usr/`
- NodeJS & npm should be installed now! Check `node --version` and `npm --version`
- We can delete the tarball and extracted folder after copying the contents
  - `rm -r node-v20.17.0-linux-x64.tar.xz node-v20.17.0-linux-x64`
