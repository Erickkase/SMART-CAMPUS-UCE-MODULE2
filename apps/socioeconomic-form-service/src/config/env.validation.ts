// Validates required environment variables depending on runtime mode and enabled features.
type EnvConfig = Record<string, string | undefined>;

export function validateEnv(config: EnvConfig): EnvConfig {
  const nodeEnv = config.NODE_ENV ?? 'development';
  const mongoEnabled =
    (config.MONGO_ENABLED ?? (nodeEnv === 'production' ? 'true' : 'false')) ===
    'true';

  if ((nodeEnv === 'production' || mongoEnabled) && !config.MONGODB_URI) {
    throw new Error(
      'Environment variable MONGODB_URI is required when MONGO_ENABLED=true',
    );
  }

  if (config.PORT) {
    const port = Number(config.PORT);
    if (Number.isNaN(port) || port <= 0) {
      throw new Error('Environment variable PORT must be a valid number');
    }
  }

  return config;
}
