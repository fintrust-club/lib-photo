enum ENVS {
  production = "production",
  development = "development",
}

const NODE_ENV: any = ENVS.production;

export const CONFIG = {
  isDevelopment: NODE_ENV === "development",
  isProduction: NODE_ENV === "production",
  ENV: NODE_ENV,
};
