
## Development

Install dependencies
```bash
npm install
```

Now use `npm run dev` to start the server
```bash
npm run dev
```

## Build & Preview

To generate/compile a build:
```bash
npm run build
```

You can preview the build with `npm run preview`.

## Production

Edit `.env` (variables like `HOST` need to be updated for production)

Use `node build` instead of `npm run ...`.
```bash
node build
```

Those `npm run ...` commands use vite, but for production, we just run the compiled sveltekit build with sveltekit's node adapter, using `node`.
