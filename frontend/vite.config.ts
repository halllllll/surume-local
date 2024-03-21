import { splitVendorChunkPlugin, defineConfig, loadEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";
import { compression } from "vite-plugin-compression2";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const apiPort = env.VITE_PORT;

	return defineConfig({
		plugins: [
			react(),
			tsconfigPaths(),
			splitVendorChunkPlugin(),
			visualizer(),
			compression(),
		],
		build: {
			rollupOptions: {
				output: {
					chunkFileNames: "assets/js/vendor/[hash].js",
					entryFileNames: "assets/js/[name].js",
				},
			},
		},
		server: {
			proxy: {
				"/api": {
					target: `http://localhost:${apiPort}`,
					// changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/api/, '/api'),
				},
				"/static": {
					target: `http://localhost:${apiPort}`,
				},
			},
		},
	});
};
