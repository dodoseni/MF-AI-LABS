/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL of the LevelUp backend API (no trailing slash), e.g.
   * `https://levelup-api-dev-xxxxxxxxxxxxx.swedencentral-01.azurewebsites.net`.
   * See `.env.example`. Falls back to the local backend dev server
   * (`http://localhost:4000`) when unset — see `src/api/client.ts`.
   */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
