type EnvConfig = Record<string, string | undefined>;

export function validateEnv(config: EnvConfig): EnvConfig {
  if (config.PORT) {
    const port = Number(config.PORT);

    if (Number.isNaN(port) || port <= 0) {
      throw new Error('Environment variable PORT must be a valid number');
    }
  }

  if (config.AUTH_ENABLED === 'true' && !config.JWT_SECRET) {
    throw new Error('Environment variable JWT_SECRET is required when AUTH_ENABLED=true');
  }

  return config;
}
