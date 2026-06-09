// Validates required environment variables depending on runtime mode.
type EnvConfig = Record<string, string | undefined>;

export function validateEnv(config: EnvConfig): EnvConfig {
  const nodeEnv = config.NODE_ENV ?? 'development';
  const dbEnabled =
    (config.DB_ENABLED ?? (nodeEnv === 'production' ? 'true' : 'false')) ===
    'true';

  const requiredVariables: string[] = [];

  // Production always requires database configuration.
  // Development only requires DB variables when DB_ENABLED=true.
  if (nodeEnv === 'production' || dbEnabled) {
    requiredVariables.push(
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_NAME',
    );
  }

  for (const variable of requiredVariables) {
    if (!config[variable]) {
      throw new Error(`Environment variable ${variable} is required`);
    }
  }

  if (config.AUTH_ENABLED === 'true' && !config.JWT_SECRET) {
    throw new Error('Environment variable JWT_SECRET is required when AUTH_ENABLED=true');
  }

  if (config.PORT) {
    const port = Number(config.PORT);

    if (Number.isNaN(port) || port <= 0) {
      throw new Error('Environment variable PORT must be a valid number');
    }
  }

  if (config.DB_PORT) {
    const dbPort = Number(config.DB_PORT);

    if (Number.isNaN(dbPort) || dbPort <= 0) {
      throw new Error('Environment variable DB_PORT must be a valid number');
    }
  }

  return config;
}
