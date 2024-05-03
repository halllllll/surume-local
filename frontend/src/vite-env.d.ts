/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_AZURE_REDIRECT_URI_PATH: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
