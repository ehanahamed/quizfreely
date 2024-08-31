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

1. Download NodeJS LTS v20 from their [prebuilt binaries](https://nodejs.org/en/download/prebuilt-binaries)
2. Extract the archive `tar -xf node-v20.17.0-linux-x64.tar.xz`
3. Install it by copying the folders `sudo cp -r node-v20.17.0-linux-x64/{bin,include,lib,share} /usr/`
4. NodeJS & npm are installed! Check it with `node --version` and `npm --version`
