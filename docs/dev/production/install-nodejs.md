# Installing NodeJS

We usually use Node.js's latest LTS version. Right now that's v22

- Download NodeJS from their [prebuilt binaries](https://nodejs.org/en/download/prebuilt-binaries)
    - You can right click the download button/link, and then paste the download url into a curl command in the droplet's console
    - for example: `curl -o nodejs.tar.xz https://nodejs.org/dist/v22.11.0/node-v22.11.0-linux-x64.tar.xz`
- Extract the archive
    - `tar -xf nodejs.tar.xz`
- Install it by copying the folders
    - `sudo cp -r node-v22.11.0-linux-x64/{bin,include,lib,share} /usr/`
- NodeJS & npm should be installed now! Check `node --version` and `npm --version`
- We can delete the tarball and extracted folder after copying the contents
    - `rm -r nodejs.tar.xz node-v22.11.0-linux-x64`
