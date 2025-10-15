/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_P2P_SIGNALING_SERVER: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ENABLE_FILE_SHARING: string
  readonly VITE_ENABLE_GROUP_CHAT: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_THEME: string
  readonly VITE_LANGUAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}