import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
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
