/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
    readonly VITE_API_AUTH_DOMAIN: string;
    readonly VITE_API_PROJECT_ID: string;
    readonly VITE_API_STORAGE_BUCKET: string;
    readonly VITE_API_MESSAGING_SENDER_ID: string;
    readonly VITE_API_APP_ID: string;
    readonly VITE_PUBLIC_KEY: string;
    readonly VITE_TEMPLATE_ID: string;
    readonly VITE_SERVICE_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}