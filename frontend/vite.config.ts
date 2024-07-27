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
			minify: true,
			outDir: "dist",
			rollupOptions: {
				plugins: [visualizer()],
				output: {
					// chunkFileNames: "assets/js/vendor/[hash].js",
					// entryFileNames: "assets/js/[name].js",
					manualChunks: (id) => {
						if (id.includes("node_modules")) {
							// if (id.includes("react-dom")) {
							// 	return "vendor_react-dom";
							// }
							if (id.includes("tanstack")) {
								return "vendor_tanstack";
							}
							if (id.includes("exceljs")) {
								return "vendor_exceljs";
							}
							if (id.includes("framer-motion")) {
								return "vendor_framer-motion";
							}
							if (id.includes("chakra-ui")) {
								return "vendor_chakra";
							}
							if (id.includes("yup")) {
								return "vendor_yup";
							}
							if (id.includes("msal-common")) {
								return "vendor_msal-common";
							}
							if (id.includes("msal-browser")) {
								return "vendor_msal-browser";
							}
							if (id.includes("date-fns")) {
								return "vendor_date_fns";
							}
							return "vendor";
						}
					},
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
