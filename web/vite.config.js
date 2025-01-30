import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import monicon from "@monicon/vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		monicon({
			icons: [
				"simple-icons:codeberg",
				"simple-icons:github",
				"material-symbols:arrow-back-rounded",
				"material-symbols:arrow-forward-rounded"
			]
		})
	],
	server: {
		port: process?.env?.PORT ?? 8080,
		proxy: {
			"/api/": {
				target: process?.env?.API_URL ?? "http://localhost:8008",
				changeOrigin: true,
				rewrite: function (path) {
					return path.replace(/^\/api/, "");
				}
			}
		}
	},
	preview: {
		port: process?.env?.PORT ?? 8080,
		proxy: {
			"/api/": {
				target: process?.env?.API_URL ?? "http://localhost:8008",
				changeOrigin: true,
				rewrite: function (path) {
					return path.replace(/^\/api/, "");
				}
			}
		}
	}
});
