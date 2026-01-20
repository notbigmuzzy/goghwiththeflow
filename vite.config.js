import { defineConfig } from 'vite'

export default defineConfig({
	base: '/goghwiththeflow/',
	build: {
		minify: 'esbuild',
		chunkSizeWarningLimit: 1200,
	},
})
