type EnvConfig = Record<string, string | undefined>;

export function validateEnv(config: EnvConfig): EnvConfig {
  const numericVariables = [
    'PORT',
    'RATE_LIMIT_TTL',
    'RATE_LIMIT_LIMIT',
    'CIRCUIT_BREAKER_TIMEOUT_MS',
    'CIRCUIT_BREAKER_FAILURE_THRESHOLD',
    'CIRCUIT_BREAKER_RESET_TIMEOUT_MS',
  ];

  for (const variable of numericVariables) {
    if (!config[variable]) {
      continue;
    }

    const value = Number(config[variable]);

    if (Number.isNaN(value) || value <= 0) {
      throw new Error(`Environment variable ${variable} must be a valid number`);
    }
  }

  if (config.AUTH_ENABLED === 'true' && !config.JWT_SECRET) {
    throw new Error('Environment variable JWT_SECRET is required when AUTH_ENABLED=true');
  }

  return config;
}
