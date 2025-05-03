export function initEnvVars() {
  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    DB_NAME: process.env.DB_NAME || "youwise",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_USER: process.env.DB_USER || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
    DB_PORT: Number(process.env.DB_PORT) || 5432,
  };
}

export type EnvVars = ReturnType<typeof initEnvVars>;
