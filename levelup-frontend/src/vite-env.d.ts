/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL of the LevelUp backend API, e.g.
   * `https://levelup-api-dev-dfgugzd7a0fvf4f7.swedencentral-01.azurewebsites.net`.
   * See `.env.example`. Not a secret — safe to expose in the built frontend bundle.
   */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
